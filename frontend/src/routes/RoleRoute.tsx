import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../contexts/AuthContext";

import RouteLoader from "../components/ui/RouteLoader";

import type {
  UserRole,
} from "../types/auth";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleRoute({
  children,
  allowedRoles,
}: RoleRouteProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <RouteLoader />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(user.role)
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