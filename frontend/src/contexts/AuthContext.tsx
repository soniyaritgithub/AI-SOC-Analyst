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
  UserRole,
} from "../types/auth";

interface AuthContextValue {
  user: User | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  role: UserRole | null;

  isAdmin: boolean;
  isManager: boolean;
  isSOCAnalyst: boolean;

  login: (
    credentials: LoginCredentials,
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;

  hasRole: (
    roles: UserRole[],
  ) => boolean;
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

      /*
       * If Login API already returns the
       * authenticated user, use it.
       */
      if (response.user) {
        setUser(response.user);
        return;
      }

      /*
       * Otherwise fetch the authenticated
       * profile using the newly stored JWT.
       */
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

  const role =
    user?.role ?? null;

  const isAdmin =
    role === "ADMIN";

  const isManager =
    role === "MANAGER";

  const isSOCAnalyst =
    role === "SOC_ANALYST";

  const hasRole = useCallback(
    (
      roles: UserRole[],
    ): boolean => {
      if (!user) {
        return false;
      }

      return roles.includes(user.role);
    },
    [user],
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

      role,
      isAdmin,
      isManager,
      isSOCAnalyst,

      login,
      logout,
      refreshUser,
      hasRole,
    }),
    [
      user,
      isLoading,
      role,
      isAdmin,
      isManager,
      isSOCAnalyst,
      login,
      logout,
      refreshUser,
      hasRole,
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