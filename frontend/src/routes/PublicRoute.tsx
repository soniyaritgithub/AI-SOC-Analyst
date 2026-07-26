import type { ReactNode } from "react";
import {
  Navigate,
} from "react-router-dom";

import FullScreenLoader from "../components/FullScreenLoader";
import { useAuth } from "../contexts/AuthContext";

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({
  children,
}: PublicRouteProps) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
}