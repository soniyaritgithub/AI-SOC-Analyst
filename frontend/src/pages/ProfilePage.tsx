import {
  Activity,
  CheckCircle2,
  LoaderCircle,
  LogOut,
  Mail,
  RefreshCw,
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

function getInitials(
  fullName?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
): string {
  const name =
    fullName?.trim() ||
    `${firstName ?? ""} ${
      lastName ?? ""
    }`.trim();

  if (name) {
    const parts = name
      .split(/\s+/)
      .filter(Boolean);

    return (
      parts
        .slice(0, 2)
        .map((part) =>
          part[0]?.toUpperCase(),
        )
        .join("") || "U"
    );
  }

  return (
    email?.trim()?.[0]?.toUpperCase() ??
    "U"
  );
}

export default function ProfilePage() {
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

  const initials = useMemo(
    () =>
      getInitials(
        user?.full_name,
        user?.first_name,
        user?.last_name,
        user?.email,
      ),
    [
      user?.full_name,
      user?.first_name,
      user?.last_name,
      user?.email,
    ],
  );

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
        "Failed to refresh profile:",
        refreshError,
      );

      setError(
        "Unable to refresh your profile. Please try again.",
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
        <ProfileSkeleton />
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div
          className="
            mx-auto
            w-full
            min-w-0
            max-w-7xl
          "
        >
          <ErrorState
            title="Profile unavailable"
            message="We could not load your account information."
            onRetry={() => {
              void handleRefresh();
            }}
            isRetrying={isRefreshing}
          />
        </div>
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
            <p
              className="
                break-words
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-soc-accent
              "
            >
              Account
            </p>

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
              My Profile
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
              View your SOC account,
              role and security status.
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
              aria-hidden="true"
              className={`
                h-4 w-4
                shrink-0

                ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }
              `}
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {error && (
          <ErrorState
            title="Unable to refresh profile"
            message={error}
            onRetry={() => {
              void handleRefresh();
            }}
            isRetrying={isRefreshing}
          />
        )}

        {/* Profile hero */}
        <section
          className="
            min-w-0
            overflow-hidden
            rounded-2xl
            border border-soc-border
            bg-soc-panel/60
          "
        >
          <div
            className="
              border-b
              border-soc-border
              bg-gradient-to-r
              from-soc-accent/10
              via-soc-panel/30
              to-soc-panel/30
              p-4

              sm:p-6
              lg:p-8
            "
          >
            <div
              className="
                flex
                min-w-0
                flex-col
                gap-5

                sm:flex-row
                sm:items-center
              "
            >
              <div
                aria-hidden="true"
                className="
                  flex
                  h-20 w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-soc-accent/20
                  bg-soc-accent/10
                  text-2xl
                  font-bold
                  text-soc-accent

                  sm:h-24
                  sm:w-24
                  sm:text-3xl
                "
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className="
                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <h3
                    className="
                      min-w-0
                      break-words
                      [overflow-wrap:anywhere]
                      text-xl
                      font-bold
                      text-soc-text

                      sm:text-2xl
                    "
                  >
                    {displayName}
                  </h3>

                  {user.is_active && (
                    <span
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-soc-success/20
                        bg-soc-success/10
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-soc-success
                      "
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="
                          h-3.5 w-3.5
                          shrink-0
                        "
                      />

                      Active
                    </span>
                  )}
                </div>

                <p
                  className="
                    mt-2
                    max-w-full
                    break-words
                    [overflow-wrap:anywhere]
                    text-sm
                    leading-6
                    text-soc-text-secondary
                  "
                >
                  {user.email}
                </p>

                <div
                  className="
                    mt-3
                    inline-flex
                    max-w-full
                    min-w-0
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-soc-accent/10
                    bg-soc-accent/5
                    px-3
                    py-1.5
                  "
                >
                  <ShieldCheck
                    aria-hidden="true"
                    className="
                      h-4 w-4
                      shrink-0
                      text-soc-accent
                    "
                  />

                  <span
                    className="
                      min-w-0
                      break-words
                      [overflow-wrap:anywhere]
                      text-xs
                      font-semibold
                      text-soc-accent
                    "
                  >
                    {formatRole(user.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Information grid */}
        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-4

            md:grid-cols-2
            md:gap-6
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
                items-center
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
                  aria-hidden="true"
                  className="
                    h-5 w-5
                    text-soc-accent
                  "
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
                  Personal Information
                </h3>

                <p
                  className="
                    mt-0.5
                    break-words
                    text-xs
                    text-soc-muted
                  "
                >
                  Your SOC identity
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
              <ProfileRow
                label="Full name"
                value={displayName}
              />

              <ProfileRow
                label="Email address"
                value={user.email}
              />

              <ProfileRow
                label="User ID"
                value={String(user.id)}
              />
            </div>
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
                items-center
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
                  aria-hidden="true"
                  className="
                    h-5 w-5
                    text-soc-success
                  "
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
                  Account & Security
                </h3>

                <p
                  className="
                    mt-0.5
                    break-words
                    text-xs
                    text-soc-muted
                  "
                >
                  Role and account status
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
              <ProfileRow
                label="Role"
                value={formatRole(
                  user.role,
                )}
              />

              <ProfileRow
                label="Account status"
                value={
                  user.is_active === false
                    ? "Inactive"
                    : "Active"
                }
              />

              <ProfileRow
                label="Authentication"
                value="JWT secured"
              />
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
                  aria-hidden="true"
                  className="
                    h-5 w-5
                    text-soc-text-secondary
                  "
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
                  You are authenticated
                  using the secured SOC
                  access token session.
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
                  aria-hidden="true"
                  className="
                    h-4 w-4
                    shrink-0
                    animate-spin
                  "
                />
              ) : (
                <LogOut
                  aria-hidden="true"
                  className="
                    h-4 w-4
                    shrink-0
                  "
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
            aria-hidden="true"
            className="
              mt-0.5
              h-3.5 w-3.5
              shrink-0
            "
          />

          <span
            className="
              min-w-0
              break-words
            "
          >
            Profile information is loaded
            from your authenticated account.
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface ProfileRowProps {
  label: string;
  value: string;
}

function ProfileRow({
  label,
  value,
}: ProfileRowProps) {
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

function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading profile"
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
            w-24
            max-w-full
            rounded
            bg-soc-border
          "
        />

        <div
          className="
            h-8
            w-48
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
          min-w-0
          rounded-2xl
          border border-soc-border
          bg-soc-panel/60
          p-4

          sm:p-6
          lg:p-8
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-col
            gap-5

            sm:flex-row
            sm:items-center
          "
        >
          <div
            className="
              h-20
              w-20
              shrink-0
              rounded-2xl
              bg-soc-border

              sm:h-24
              sm:w-24
            "
          />

          <div
            className="
              min-w-0
              flex-1
              space-y-3
            "
          >
            <div
              className="
                h-6
                w-48
                max-w-full
                rounded
                bg-soc-border
              "
            />

            <div
              className="
                h-4
                w-64
                max-w-full
                rounded
                bg-soc-border
              "
            />

            <div
              className="
                h-7
                w-28
                max-w-full
                rounded
                bg-soc-border
              "
            />
          </div>
        </div>
      </div>

      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-4

          md:grid-cols-2
          md:gap-6
        "
      >
        {[1, 2].map((item) => (
          <div
            key={item}
            aria-hidden="true"
            className="
              h-64
              min-w-0
              rounded-2xl
              border border-soc-border
              bg-soc-panel/60

              sm:h-72
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
        "
      />

      <span className="sr-only">
        Loading profile information...
      </span>
    </div>
  );
}