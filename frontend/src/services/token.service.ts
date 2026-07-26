const ACCESS_TOKEN_KEY =
  "ai_soc_access_token";

const REFRESH_TOKEN_KEY =
  "ai_soc_refresh_token";

export const tokenService = {
  getAccessToken(): string | null {
    return localStorage.getItem(
      ACCESS_TOKEN_KEY,
    );
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(
      REFRESH_TOKEN_KEY,
    );
  },

  setTokens(
    accessToken: string,
    refreshToken: string,
  ): void {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken,
    );

    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      refreshToken,
    );
  },

  setAccessToken(
    accessToken: string,
  ): void {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken,
    );
  },

  setRefreshToken(
    refreshToken: string,
  ): void {
    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      refreshToken,
    );
  },

  clearTokens(): void {
    localStorage.removeItem(
      ACCESS_TOKEN_KEY,
    );

    localStorage.removeItem(
      REFRESH_TOKEN_KEY,
    );
  },

  hasTokens(): boolean {
    return Boolean(
      localStorage.getItem(
        ACCESS_TOKEN_KEY,
      ) &&
        localStorage.getItem(
          REFRESH_TOKEN_KEY,
        ),
    );
  },
};