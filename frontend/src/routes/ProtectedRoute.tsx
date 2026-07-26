import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import FullScreenLoader from "../components/FullScreenLoader";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return <FullScreenLoader />;
  }

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

  return <>{children}</>;
}