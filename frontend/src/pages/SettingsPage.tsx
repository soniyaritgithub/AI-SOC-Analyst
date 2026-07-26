import {
  Activity,
  CheckCircle2,
  LoaderCircle,
  LogOut,
  Mail,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import ErrorState from "../components/ui/ErrorState";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  useAuth,
} from "../contexts/AuthContext";

function formatRole(
  role?: string,
): string {
  if (!role) {
    return "User";
  }

  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const {
    user,
    isLoading,
    refreshUser,
    logout,
  } = useAuth();

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const displayName = useMemo(() => {
    if (!user) {
      return "SOC User";
    }

    if (user.full_name?.trim()) {
      return user.full_name.trim();
    }

    const combinedName =
      `${user.first_name ?? ""} ${
        user.last_name ?? ""
      }`.trim();

    if (combinedName) {
      return combinedName;
    }

    return user.email || "SOC User";
  }, [user]);

  const handleRefresh = async () => {
    if (isRefreshing) {
      return;
    }

    try {
      setError(null);
      setIsRefreshing(true);

      await refreshUser();
    } catch (refreshError) {
      console.error(
        "Failed to refresh settings:",
        refreshError,
      );

      setError(
        "Unable to refresh account information. Please try again.",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setError(null);
      setIsLoggingOut(true);

      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (logoutError) {
      console.error(
        "Logout failed:",
        logoutError,
      );

      navigate("/login", {
        replace: true,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <SettingsSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        className="
          mx-auto
          w-full
          min-w-0
          max-w-7xl
          space-y-5

          sm:space-y-6
        "
      >
        {/* Page heading */}
        <div
          className="
            flex
            min-w-0
            flex-col
            gap-4

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
                text-soc-accent
              "
            >
              <Settings
                className="
                  h-4 w-4
                  shrink-0
                "
                aria-hidden="true"
              />

              <p
                className="
                  min-w-0
                  break-words
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                "
              >
                System Preferences
              </p>
            </div>

            <h2
              className="
                mt-2
                break-words
                text-2xl
                font-bold
                tracking-tight
                text-soc-text

                sm:text-3xl
              "
            >
              Settings
            </h2>

            <p
              className="
                mt-2
                max-w-2xl
                break-words
                text-sm
                leading-6
                text-soc-muted
              "
            >
              Review your account,
              authentication and current
              SOC session settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleRefresh();
            }}
            disabled={isRefreshing}
            className="
              inline-flex
              min-h-11
              w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              border border-soc-border
              bg-soc-panel
              px-4
              py-2.5
              text-sm
              font-semibold
              text-soc-text-secondary
              transition-colors
              duration-200

              hover:border-soc-subtle/50
              hover:text-soc-text

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-soc-accent/50
              focus-visible:ring-offset-2
              focus-visible:ring-offset-soc-page

              disabled:cursor-not-allowed
              disabled:opacity-60

              sm:w-auto
            "
          >
            <RefreshCw
              className={`
                h-4 w-4
                shrink-0

                ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }
              `}
              aria-hidden="true"
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {error && (
          <ErrorState
            title="Settings unavailable"
            message={error}
            onRetry={() => {
              void handleRefresh();
            }}
            isRetrying={isRefreshing}
          />
        )}

        {!user ? (
          <ErrorState
            title="Account information unavailable"
            message="Your account information could not be loaded from the authenticated user endpoint."
            onRetry={() => {
              void handleRefresh();
            }}
            isRetrying={isRefreshing}
          />
        ) : (
          <>
            {/* Settings grid */}
            <div
              className="
                grid
                min-w-0
                grid-cols-1
                gap-4

                lg:grid-cols-2
                lg:gap-6
              "
            >
              <section
                className="
                  h-full
                  min-w-0
                  rounded-2xl
                  border border-soc-border
                  bg-soc-panel/60
                  p-4

                  sm:p-5
                  lg:p-6
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-soc-accent/10
                      bg-soc-accent/10
                    "
                  >
                    <UserRound
                      className="
                        h-5 w-5
                        text-soc-accent
                      "
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        break-words
                        font-semibold
                        text-soc-text
                      "
                    >
                      Account
                    </h3>

                    <p
                      className="
                        mt-1
                        break-words
                        text-xs
                        leading-5
                        text-soc-muted
                      "
                    >
                      Information associated
                      with your SOC account.
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-6
                    divide-y
                    divide-soc-border
                  "
                >
                  <SettingsRow
                    label="Display name"
                    value={displayName}
                  />

                  <SettingsRow
                    label="Email address"
                    value={user.email}
                  />

                  <SettingsRow
                    label="Role"
                    value={formatRole(
                      user.role,
                    )}
                  />

                  <SettingsRow
                    label="User ID"
                    value={String(user.id)}
                  />
                </div>

                <p
                  className="
                    mt-5
                    break-words
                    text-xs
                    leading-5
                    text-soc-subtle
                  "
                >
                  Account details are
                  currently managed by the
                  authenticated user API and
                  are read-only here.
                </p>
              </section>

              <section
                className="
                  h-full
                  min-w-0
                  rounded-2xl
                  border border-soc-border
                  bg-soc-panel/60
                  p-4

                  sm:p-5
                  lg:p-6
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-soc-success/10
                      bg-soc-success/10
                    "
                  >
                    <ShieldCheck
                      className="
                        h-5 w-5
                        text-soc-success
                      "
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        break-words
                        font-semibold
                        text-soc-text
                      "
                    >
                      Security
                    </h3>

                    <p
                      className="
                        mt-1
                        break-words
                        text-xs
                        leading-5
                        text-soc-muted
                      "
                    >
                      Authentication and
                      account security
                      information.
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-6
                    divide-y
                    divide-soc-border
                  "
                >
                  <SettingsRow
                    label="Account status"
                    value={
                      user.is_active === false
                        ? "Inactive"
                        : "Active"
                    }
                  />

                  <SettingsRow
                    label="Authentication"
                    value="JWT secured"
                  />

                  <SettingsRow
                    label="Session"
                    value="Authenticated"
                  />
                </div>

                <div
                  className="
                    mt-5
                    flex
                    min-w-0
                    items-start
                    gap-2
                    rounded-xl
                    border
                    border-soc-success/10
                    bg-soc-success/5
                    p-3
                  "
                >
                  <CheckCircle2
                    className="
                      mt-0.5
                      h-4 w-4
                      shrink-0
                      text-soc-success
                    "
                    aria-hidden="true"
                  />

                  <p
                    className="
                      min-w-0
                      break-words
                      text-xs
                      leading-5
                      text-soc-success
                    "
                  >
                    Your current session is
                    protected using the
                    application's JWT
                    authentication flow.
                  </p>
                </div>
              </section>
            </div>

            {/* Current session */}
            <section
              className="
                min-w-0
                rounded-2xl
                border border-soc-border
                bg-soc-panel/60
                p-4

                sm:p-5
                lg:p-6
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  flex-col
                  gap-5

                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border border-soc-border
                      bg-soc-page
                    "
                  >
                    <Activity
                      className="
                        h-5 w-5
                        text-soc-text-secondary
                      "
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        break-words
                        font-semibold
                        text-soc-text
                      "
                    >
                      Current Session
                    </h3>

                    <p
                      className="
                        mt-1
                        max-w-2xl
                        break-words
                        text-sm
                        leading-6
                        text-soc-muted
                      "
                    >
                      Signing out invalidates
                      the current refresh token
                      through the existing
                      logout API and clears
                      local authentication.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="
                    inline-flex
                    min-h-11
                    w-full
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-soc-critical/20
                    bg-soc-critical/10
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-soc-critical
                    transition-colors
                    duration-200

                    hover:bg-soc-critical/15

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-soc-critical/50
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-soc-page

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    lg:w-auto
                  "
                >
                  {isLoggingOut ? (
                    <LoaderCircle
                      className="
                        h-4 w-4
                        shrink-0
                        animate-spin
                      "
                      aria-hidden="true"
                    />
                  ) : (
                    <LogOut
                      className="
                        h-4 w-4
                        shrink-0
                      "
                      aria-hidden="true"
                    />
                  )}

                  {isLoggingOut
                    ? "Signing out..."
                    : "Sign out"}
                </button>
              </div>
            </section>

            <div
              className="
                flex
                min-w-0
                items-start
                gap-2
                px-1
                text-xs
                leading-5
                text-soc-subtle
              "
            >
              <Mail
                className="
                  mt-0.5
                  h-3.5 w-3.5
                  shrink-0
                "
                aria-hidden="true"
              />

              <span
                className="
                  min-w-0
                  break-words
                "
              >
                Account information is loaded
                from your authenticated
                current user endpoint.
              </span>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

interface SettingsRowProps {
  label: string;
  value: string;
}

function SettingsRow({
  label,
  value,
}: SettingsRowProps) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        gap-1.5
        py-4

        first:pt-0
        last:pb-0

        sm:flex-row
        sm:items-start
        sm:justify-between
        sm:gap-6
      "
    >
      <span
        className="
          shrink-0
          text-sm
          text-soc-muted
        "
      >
        {label}
      </span>

      <span
        className="
          min-w-0
          max-w-full
          break-words
          [overflow-wrap:anywhere]
          text-sm
          font-medium
          text-soc-text-secondary

          sm:text-right
        "
      >
        {value}
      </span>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading settings"
      className="
        mx-auto
        w-full
        min-w-0
        max-w-7xl
        animate-pulse
        space-y-5

        sm:space-y-6
      "
    >
      <div className="space-y-3">
        <div
          className="
            h-3
            w-32
            max-w-full
            rounded
            bg-soc-border
          "
        />

        <div
          className="
            h-8
            w-40
            max-w-full
            rounded
            bg-soc-border
          "
        />

        <div
          className="
            h-4
            w-full
            max-w-md
            rounded
            bg-soc-border
          "
        />
      </div>

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-4

          lg:grid-cols-2
          lg:gap-6
        "
      >
        {[1, 2].map((item) => (
          <div
            key={item}
            aria-hidden="true"
            className="
              h-72
              min-w-0
              rounded-2xl
              border border-soc-border
              bg-soc-panel/60

              sm:h-80
            "
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="
          h-36
          min-w-0
          rounded-2xl
          border border-soc-border
          bg-soc-panel/60

          sm:h-40
        "
      />

      <span className="sr-only">
        Loading settings...
      </span>
    </div>
  );
}