/**
 * Token storage utility for managing auth tokens in localStorage
 */
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  setAccessToken: (accessToken: string): void => {
    localStorage.setItem("authToken", accessToken);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  },

  hasTokens: (): boolean => {
    return !!(tokenStorage.getAccessToken() && tokenStorage.getRefreshToken());
  },
};
