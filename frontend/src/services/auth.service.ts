import axios from "axios";

import { API_ENDPOINTS } from "../constants/api";
import { env } from "../lib/env";
import type {
  LoginCredentials,
  LoginResponse,
  User,
} from "../types/auth";

import api from "./api";
import { tokenService } from "./token.service";

const authClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const authService = {
  async login(
    credentials: LoginCredentials,
  ): Promise<LoginResponse> {
    const response = await authClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );

    const { access, refresh } = response.data;

    if (!access || !refresh) {
      throw new Error(
        "Login response does not contain access and refresh tokens.",
      );
    }

    tokenService.setTokens(access, refresh);

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(
      API_ENDPOINTS.AUTH.ME,
    );

    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken =
      tokenService.getRefreshToken();

    try {
      if (refreshToken) {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT, {
          refresh: refreshToken,
        });
      }
    } finally {
      tokenService.clearTokens();
    }
  },
};