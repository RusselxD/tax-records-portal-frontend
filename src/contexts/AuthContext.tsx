import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { LoginRequest, LoginResponse, User } from "../types/auth";
import type { UserRoleType } from "../constants";
import { authAPI } from "../api/auth";
import { tokenStorage } from "../lib/token-storage";
import { refreshAccessToken } from "../api/axios-config";

interface JwtClaims {
  sub: string; // user UUID
  email: string;
  name: string; // formatted name with titles (e.g. "CPA John Doe, MBA")
  role: string; // display name (e.g. "Manager", "Quality, Training & Development")
  roleKey: UserRoleType; // logic key (e.g. "MANAGER", "QTD")
  permissions: string[];
  position: string | null;
  status: string;
  profile_url: string | null;
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  loginWithTokens: (response: LoginResponse) => User;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decodes a JWT token and returns the payload
 */
function decodeJwt(token: string): JwtClaims | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload) as JwtClaims;
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 */
function isTokenExpired(exp: number): boolean {
  return Date.now() >= exp * 1000;
}

/**
 * Converts JWT claims to normalized User object
 */
function claimsToUser(claims: JwtClaims): User {
  return {
    id: claims.sub,
    email: claims.email,
    name: claims.name,
    role: claims.role,
    roleKey: claims.roleKey,
    permissions: claims.permissions,
    position: claims.position,
    status: claims.status,
    profileUrl: claims.profile_url,
  };
}

function handleDeactivated(): null {
  tokenStorage.clearTokens();
  if (!window.location.pathname.includes("/auth/login")) {
    window.location.href = "/auth/login?deactivated=true";
  }
  return null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from stored token on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = tokenStorage.getAccessToken();

      if (accessToken) {
        const claims = decodeJwt(accessToken);

        if (claims && !isTokenExpired(claims.exp)) {
          if (claims.status === "DEACTIVATED") {
            handleDeactivated();
          } else {
            setUser(claimsToUser(claims));
          }
        } else if (tokenStorage.getRefreshToken()) {
          // Access token expired but refresh token exists — attempt refresh
          try {
            const tokens = await refreshAccessToken();
            if (tokens) {
              const newClaims = decodeJwt(tokens.accessToken);
              if (newClaims) {
                if (newClaims.status === "DEACTIVATED") {
                  handleDeactivated();
                } else {
                  setUser(claimsToUser(newClaims));
                }
              } else {
                tokenStorage.clearTokens();
              }
            }
          } catch {
            tokenStorage.clearTokens();
          }
        } else {
          tokenStorage.clearTokens();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<User> => {
      const response = await authAPI.login(credentials);

      tokenStorage.setTokens(response.accessToken, response.refreshToken);

      const claims = decodeJwt(response.accessToken);
      if (!claims) {
        throw new Error("Invalid token received");
      }

      const loggedInUser = claimsToUser(claims);
      setUser(loggedInUser);
      return loggedInUser;
    },
    [],
  );

  const loginWithTokens = useCallback((response: LoginResponse): User => {
    tokenStorage.setTokens(response.accessToken, response.refreshToken);

    const claims = decodeJwt(response.accessToken);
    if (!claims) {
      throw new Error("Invalid token received");
    }

    const authenticatedUser = claimsToUser(claims);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearTokens();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithTokens,
      logout,
      updateUser,
    }),
    [user, isLoading, login, loginWithTokens, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
