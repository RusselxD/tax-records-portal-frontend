# Authentication

## JWT Structure

The backend issues JWTs containing the following claims:

| Claim | Type | Description |
|-------|------|-------------|
| `sub` | `string` | User UUID |
| `email` | `string` | User email address |
| `name` | `string` | Formatted name with titles (e.g. "CPA John Doe, MBA") |
| `role` | `string` | Display name (e.g. "Manager", "Quality, Training & Development") |
| `roleKey` | `UserRoleType` | Logic key used for routing and guards (`MANAGER`, `OOS`, `QTD`, `CSD`, `BILLING`, `VIEWER`, `CLIENT`) |
| `permissions` | `string[]` | Permission strings for component-level access control |
| `position` | `string \| null` | Job position title |
| `status` | `string` | Account status (e.g. "ACTIVE", "DEACTIVATED") |
| `profile_url` | `string \| null` | Profile image path |
| `iat` | `number` | Issued-at timestamp |
| `exp` | `number` | Expiration timestamp |

Two tokens are issued on login:

- **accessToken** -- short-lived, attached to every API request via the `Authorization: Bearer` header.
- **refreshToken** -- long-lived, used to obtain a new token pair when the access token expires.

Both are stored in `localStorage` via the `tokenStorage` utility (`src/lib/token-storage.ts`), under the keys `authToken` and `refreshToken`.

## Auth Flow

1. User submits credentials. `authAPI.login()` calls `POST /api/v1/auth/login` and returns `{ accessToken, refreshToken, tokenType }`.
2. `AuthContext.login()` stores both tokens via `tokenStorage.setTokens()`, decodes the JWT client-side using base64 parsing (no library), and creates an in-memory `User` object from the claims.
3. On page load, `AuthProvider` runs an initialization effect:
   - Reads the stored access token.
   - If present and not expired, decodes it and sets the user.
   - If expired but a refresh token exists, calls `refreshAccessToken()` to get a new pair.
   - If refresh fails or no tokens exist, clears storage.
4. Deactivated users: if the decoded JWT has `status === "DEACTIVATED"`, tokens are cleared and the browser is redirected to `/auth/login?deactivated=true`.

The initialization effect uses a `cancelled` flag to prevent state updates if the component unmounts during the async refresh.

### `loginWithTokens`

A secondary login path (`loginWithTokens`) accepts a `LoginResponse` directly and sets user state without making an API call. This is used for flows where the backend returns tokens outside the normal login endpoint (e.g. password reset).

### Logout

`AuthContext.logout()` fires a best-effort `POST /api/v1/auth/logout` with the refresh token (errors are swallowed), clears `localStorage`, and sets the user to `null`.

## Token Refresh

The Axios response interceptor in `src/api/axios-config.ts` handles automatic token refresh:

```typescript
// Simplified flow
if ((status === 401 || status === 403) && !originalRequest._retry) {
  originalRequest._retry = true;
  // Deduplicate concurrent refresh attempts via shared promise
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  const tokens = await refreshPromise;
  if (tokens) {
    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
    return apiClient(originalRequest);
  }
}
```

Key behaviors:

- **Deduplication**: A module-level `refreshPromise` variable ensures that concurrent 401s from multiple requests trigger only a single refresh call. All waiting requests share the same promise.
- **Deactivated accounts**: A 403 with the message `"Your account has been deactivated."` short-circuits the interceptor -- no refresh attempt, immediate redirect to login.
- **Rate limiting**: 429 responses are rejected immediately without triggering a refresh.
- **Refresh failure**: Clears tokens and redirects to `/auth/login`.

The request interceptor attaches the stored access token to every outgoing request:

```typescript
config.headers.Authorization = `Bearer ${tokenStorage.getAccessToken()}`;
```

## Token Storage

`src/lib/token-storage.ts` provides a thin wrapper over `localStorage`:

| Method | Description |
|--------|-------------|
| `getAccessToken()` | Returns the stored access token or `null` |
| `getRefreshToken()` | Returns the stored refresh token or `null` |
| `setAccessToken(accessToken)` | Stores only the access token (used by `refreshFromToken`) |
| `setTokens(accessToken, refreshToken)` | Stores both tokens |
| `clearTokens()` | Removes both tokens |
| `hasTokens()` | Returns `true` if both tokens are present |

Storage keys: `authToken` (access), `refreshToken` (refresh).

## Route Guards

### AuthGuard (`src/guards/AuthGuard.tsx`)

Wraps all authenticated routes. Behavior:

- **Loading**: Shows a branded splash screen (logo + animated dots) while `AuthContext` initializes.
- **Not authenticated**: Redirects to `/auth/login`, preserving the attempted URL in `location.state.from` for post-login redirect.
- **Authenticated**: Renders child routes via `<Outlet />`.

### RoleGuard (`src/guards/RoleGuard.tsx`)

Restricts routes to specific `roleKey` values. Accepts an `allowedRoles: UserRoleType[]` prop.

- **No user**: Redirects to `/auth/login`.
- **Role not in `allowedRoles`**: Redirects to the user's own dashboard via `getDashboardUrl(user.roleKey)`.
- **Allowed**: Renders child routes via `<Outlet />`.

Guards are layered in the router: `AuthGuard` wraps everything, then `RoleGuard` wraps role-specific route groups.

## User Object

```typescript
interface User {
  id: string;          // from JWT `sub`
  email: string;
  name: string;        // formatted with titles
  role: string;        // display name (e.g. "Manager")
  roleKey: UserRoleType; // logic key (e.g. "MANAGER")
  permissions: string[];
  position: string | null;
  status: string;
  profileUrl: string | null; // mapped from JWT `profile_url`
}
```

The `claimsToUser()` function in `AuthContext` maps JWT snake_case fields (`profile_url`) to camelCase (`profileUrl`).

## updateUser

`AuthContext` exposes `updateUser(updates: Partial<User>)` which patches the in-memory user state:

```typescript
const updateUser = useCallback((updates: Partial<User>) => {
  setUser((prev) => (prev ? { ...prev, ...updates } : prev));
}, []);
```

This is used for lightweight in-session patches. It does **not** persist to the backend or modify the stored JWT -- changes last only until the next page reload or token refresh.

## refreshFromToken

`AuthContext` exposes `refreshFromToken(accessToken: string)` for profile-mutating endpoints that return a new JWT:

```typescript
const refreshFromToken = useCallback((accessToken: string) => {
  tokenStorage.setAccessToken(accessToken);
  const claims = decodeJwt(accessToken);
  if (claims) setUser(claimsToUser(claims));
}, []);
```

Used by `PATCH /users/me`, `POST /users/me/avatar`, and `DELETE /users/me/avatar` -- these endpoints return a fresh `accessToken` with updated claims (`name`, `email`, `profile_url`). This replaces the stored token and re-derives user state, so both the current session and subsequent page reloads reflect the changes.

## Rate Limiting

Auth-related endpoints (login, forgot-password, reset-password, activate-account, change-password) may return 429 when rate-limited. The utility `isRateLimitedError()` from `src/lib/api-error.ts` checks for this:

```typescript
export function isRateLimitedError(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 429;
}
```

Components consuming auth endpoints use this to show appropriate rate-limit messaging. The Axios interceptor also skips token refresh on 429 responses to avoid masking the rate limit error.

## Auth API Endpoints

Defined in `src/api/auth.ts`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `login(request)` | `POST /auth/login` | Returns `{ accessToken, refreshToken, tokenType }` |
| `forgotPassword(email)` | `POST /auth/forgot-password` | Initiates password reset flow |
| `resetPassword(token, newPassword)` | `POST /auth/reset-password` | Returns new token pair on success |
| `logout(refreshToken)` | `POST /auth/logout` | Invalidates the refresh token server-side |

Token refresh is handled separately in `axios-config.ts` via a direct Axios call (not through `apiClient`) to avoid interceptor loops:

```typescript
const { data } = await axios.post<RefreshTokenResponse>(
  `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
  { refreshToken },
);
```

## Key Files

| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | Auth state management, login/logout, JWT decoding |
| `src/guards/AuthGuard.tsx` | Route protection for unauthenticated users |
| `src/guards/RoleGuard.tsx` | Route protection by role |
| `src/lib/token-storage.ts` | localStorage wrapper for token persistence |
| `src/api/axios-config.ts` | Axios instance with auth interceptors and token refresh |
| `src/api/auth.ts` | Auth API endpoint wrappers |
| `src/types/auth.ts` | `User`, `LoginRequest`, `LoginResponse` type definitions |
| `src/lib/api-error.ts` | Error utilities including `isRateLimitedError()` |
