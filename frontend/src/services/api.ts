import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_ENDPOINTS } from "../constants/api";
import { env } from "../lib/env";
import { tokenService } from "./token.service";

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

interface RefreshSubscriber {
  resolve: (accessToken: string) => void;
  reject: (error: unknown) => void;
}

const api = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken =
      tokenService.getAccessToken();

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;

let refreshSubscribers:
  RefreshSubscriber[] = [];

const subscribeToTokenRefresh = (
  resolve: (
    accessToken: string,
  ) => void,
  reject: (
    error: unknown,
  ) => void,
): void => {
  refreshSubscribers.push({
    resolve,
    reject,
  });
};

const resolveRefreshSubscribers = (
  accessToken: string,
): void => {
  refreshSubscribers.forEach(
    (subscriber) => {
      subscriber.resolve(
        accessToken,
      );
    },
  );

  refreshSubscribers = [];
};

const rejectRefreshSubscribers = (
  error: unknown,
): void => {
  refreshSubscribers.forEach(
    (subscriber) => {
      subscriber.reject(error);
    },
  );

  refreshSubscribers = [];
};

const redirectToLogin = (): void => {
  tokenService.clearTokens();

  if (
    window.location.pathname !==
    "/login"
  ) {
    window.location.replace(
      "/login",
    );
  }
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | RetryableRequestConfig
        | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status =
      error.response?.status;

    /*
     * Only attempt token refresh
     * for unauthorized responses.
     */
    if (status !== 401) {
      return Promise.reject(error);
    }

    /*
     * Prevent the same request from
     * entering an infinite refresh loop.
     */
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const requestUrl =
      originalRequest.url ?? "";

    /*
     * Authentication endpoints must never
     * trigger another token refresh.
     */
    const isAuthRequest =
      requestUrl.includes(
        API_ENDPOINTS.AUTH.LOGIN,
      ) ||
      requestUrl.includes(
        API_ENDPOINTS.AUTH.REFRESH,
      );

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    const refreshToken =
      tokenService.getRefreshToken();

    /*
     * Without a refresh token the session
     * cannot be recovered.
     */
    if (!refreshToken) {
      redirectToLogin();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /*
     * Another request is already refreshing
     * the access token.
     *
     * Queue this request until that refresh
     * either succeeds or fails.
     */
    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          subscribeToTokenRefresh(
            (accessToken) => {
              originalRequest.headers.Authorization =
                `Bearer ${accessToken}`;

              resolve(
                api(originalRequest),
              );
            },

            (refreshError) => {
              reject(refreshError);
            },
          );
        },
      );
    }

    isRefreshing = true;

    try {
      const response =
        await refreshClient.post<RefreshTokenResponse>(
          API_ENDPOINTS.AUTH.REFRESH,
          {
            refresh:
              refreshToken,
          },
        );

      const newAccessToken =
        response.data.access;

      if (!newAccessToken) {
        throw new Error(
          "Refresh endpoint did not return an access token.",
        );
      }

      /*
       * Save the newly issued access token.
       */
      tokenService.setAccessToken(
        newAccessToken,
      );

      /*
       * Some JWT backends rotate refresh
       * tokens. Preserve the new token when
       * the API returns one.
       */
      if (response.data.refresh) {
        tokenService.setRefreshToken(
          response.data.refresh,
        );
      }

      /*
       * Resume every request waiting for
       * the refresh operation.
       */
      resolveRefreshSubscribers(
        newAccessToken,
      );

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(
        originalRequest,
      );
    } catch (refreshError) {
      /*
       * Reject every queued request.
       * This prevents unresolved promises
       * when token refresh fails.
       */
      rejectRefreshSubscribers(
        refreshError,
      );

      redirectToLogin();

      return Promise.reject(
        refreshError,
      );
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;