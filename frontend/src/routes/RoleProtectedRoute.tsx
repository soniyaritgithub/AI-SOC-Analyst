import type {
  ReactNode,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import FullScreenLoader from "../components/FullScreenLoader";

import {
  hasRequiredRole,
} from "../constants/permissions";

import {
  useAuth,
} from "../contexts/AuthContext";

import type {
  UserRole,
} from "../types/auth";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: readonly UserRole[];
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  /*
   * Authentication check.
   *
   * If the user is not authenticated,
   * redirect them to the login page and
   * preserve the requested location.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
   * Authorization check.
   *
   * Authenticated users without the
   * required role are redirected to
   * the professional 403 page.
   */
  if (
    !hasRequiredRole(
      user?.role,
      allowedRoles,
    )
  ) {
    return (
      <Navigate
        to="/forbidden"
        replace
      />
    );
  }

  return <>{children}</>;
}