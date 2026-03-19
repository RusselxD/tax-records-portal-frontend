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

const redirectToLogin = (): void => {
  tokenStorage.clearTokens();
  if (!window.location.pathname.includes("/auth/login")) {
    window.location.href = "/auth/login";
  }
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

    const status = error.response?.status;
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
      } catch {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
