import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";

import type {
  LoginCredentials,
  User,
} from "../types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    credentials: LoginCredentials,
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const refreshUser = useCallback(
    async () => {
      if (!tokenService.getAccessToken()) {
        setUser(null);
        return;
      }

      try {
        const currentUser =
          await authService.getCurrentUser();

        setUser(currentUser);
      } catch {
        tokenService.clearTokens();
        setUser(null);
      }
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        if (!tokenService.getAccessToken()) {
          return;
        }

        const currentUser =
          await authService.getCurrentUser();

        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        tokenService.clearTokens();

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (
      credentials: LoginCredentials,
    ) => {
      const response =
        await authService.login(credentials);

      if (response.user) {
        setUser(response.user);
        return;
      }

      const currentUser =
        await authService.getCurrentUser();

      setUser(currentUser);
    },
    [],
  );

  const logout = useCallback(
    async () => {
      try {
        await authService.logout();
      } finally {
        tokenService.clearTokens();
        setUser(null);
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,

      isAuthenticated:
        Boolean(user) &&
        Boolean(
          tokenService.getAccessToken(),
        ),

      isLoading,

      login,
      logout,
      refreshUser,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}