import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../lib/token-storage";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: Promise<TokenPair | null> | null = null;

export const UPLOAD_TIMEOUT_MS = 60_000;

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

const DEACTIVATED_MESSAGE = "Your account has been deactivated.";

const redirectToLogin = (): void => {
  tokenStorage.clearTokens();
  if (!window.location.pathname.includes("/auth/login")) {
    window.location.href = "/auth/login";
  }
};

const isDeactivatedResponse = (error: AxiosError): boolean => {
  const data = error.response?.data as { message?: string } | undefined;
  return error.response?.status === 403 && data?.message === DEACTIVATED_MESSAGE;
};

export const refreshAccessToken = async (): Promise<TokenPair | null> => {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    redirectToLogin();
    return null;
  }

  const { data } = await axios.post<RefreshTokenResponse>(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
    { refreshToken },
    {
      headers: { "Content-Type": "application/json" },
    },
  );

  tokenStorage.setTokens(data.accessToken, data.refreshToken);
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Deactivated account — don't attempt refresh, just redirect
    if (isDeactivatedResponse(error)) {
      redirectToLogin();
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // 429 — rate limited, don't retry or refresh
    if (status === 429) {
      return Promise.reject(error);
    }

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
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
      } catch (refreshError) {
        console.error("[auth] Token refresh failed:", refreshError);
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
