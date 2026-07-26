import {
  lazy,
  Suspense,
  type ReactNode,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { DashboardSocketProvider } from "./contexts/DashboardSocketContext";

import RouteLoader from "./components/ui/RouteLoader";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import RoleRoute from "./routes/RoleRoute";

import type {
  UserRole,
} from "./types/auth";

/*
 * Route-level code splitting.
 *
 * Each page is loaded only when its route
 * is requested instead of being included
 * in the initial application bundle.
 */
const LoginPage = lazy(
  () => import("./pages/LoginPage"),
);

const DashboardPage = lazy(
  () => import("./pages/DashboardPage"),
);

const IncidentsPage = lazy(
  () => import("./pages/IncidentsPage"),
);

const IncidentDetailPage = lazy(
  () => import("./pages/IncidentDetailPage"),
);

const AnalyticsPage = lazy(
  () => import("./pages/AnalyticsPage"),
);

const ProfilePage = lazy(
  () => import("./pages/ProfilePage"),
);

const SettingsPage = lazy(
  () => import("./pages/SettingsPage"),
);

const ForbiddenPage = lazy(
  () => import("./pages/ForbiddenPage"),
);

const NotFoundPage = lazy(
  () => import("./pages/NotFoundPage"),
);

const RegisterPage = lazy(
  () => import("./pages/RegisterPage"),
);
interface ProtectedSocketRouteProps {
  children: ReactNode;
}
interface ProtectedRoleSocketRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

function ProtectedRoleSocketRoute({
  children,
  allowedRoles,
}: ProtectedRoleSocketRouteProps) {
  return (
    <ProtectedRoute>
      <RoleRoute
        allowedRoles={allowedRoles}
      >
        <DashboardSocketProvider>
          {children}
        </DashboardSocketProvider>
      </RoleRoute>
    </ProtectedRoute>
  );
}
function ProtectedSocketRoute({
  children,
}: ProtectedSocketRouteProps) {
  return (
    <ProtectedRoute>
      <DashboardSocketProvider>
        {children}
      </DashboardSocketProvider>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Root */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Public route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
<Route
  path="/register"
  element={
    <PublicRoute>
      <RegisterPage />
    </PublicRoute>
  }
/>
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedSocketRoute>
              <DashboardPage />
            </ProtectedSocketRoute>
          }
        />

        {/* Incidents */}
        <Route
          path="/incidents"
          element={
            <ProtectedSocketRoute>
              <IncidentsPage />
            </ProtectedSocketRoute>
          }
        />

        {/* Incident details */}
        <Route
          path="/incidents/:id"
          element={
            <ProtectedSocketRoute>
              <IncidentDetailPage />
            </ProtectedSocketRoute>
          }
        />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedSocketRoute>
              <AnalyticsPage />
            </ProtectedSocketRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedSocketRoute>
              <ProfilePage />
            </ProtectedSocketRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedSocketRoute>
              <SettingsPage />
            </ProtectedSocketRoute>
          }
        />

        {/* Forbidden */}
        <Route
          path="/forbidden"
          element={
            <ProtectedRoute>
              <ForbiddenPage />
            </ProtectedRoute>
          }
        />

        {/* Not found */}
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </Suspense>
  );
}