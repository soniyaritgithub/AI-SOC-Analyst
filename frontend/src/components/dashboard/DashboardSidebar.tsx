import {
  Activity,
  BarChart3,
  FileBarChart,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import {
  ALL_USER_ROLES,
  MANAGEMENT_ROLES,
  hasRequiredRole,
} from "../../constants/permissions";

import type { UserRole } from "../../types/auth";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  enabled: boolean;
  roles: readonly UserRole[];
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    enabled: true,
    roles: ALL_USER_ROLES,
  },
  {
    label: "Incidents",
    icon: ShieldAlert,
    path: "/incidents",
    enabled: true,
    roles: ALL_USER_ROLES,
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
    enabled: true,
    roles: ALL_USER_ROLES,
  },
  {
    label: "Threat Detection",
    icon: Activity,
    path: "/threat-detection",
    enabled: false,
    roles: ALL_USER_ROLES,
  },
  {
    label: "Reports",
    icon: FileBarChart,
    path: "/reports",
    enabled: false,
    roles: MANAGEMENT_ROLES,
  },
  {
    label: "Audit Logs",
    icon: ScrollText,
    path: "/audit-logs",
    enabled: false,
    roles: MANAGEMENT_ROLES,
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
    enabled: true,
    roles: ALL_USER_ROLES,
  },
  {
    label: "Profile",
    icon: UserRound,
    path: "/profile",
    enabled: true,
    roles: ALL_USER_ROLES,
  },
];

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const { user } = useAuth();

  const visibleNavigationItems =
    navigationItems.filter((item) =>
      hasRequiredRole(
        user?.role,
        item.roles,
      ),
    );

  return (
    <>
      {/* Mobile / tablet backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-soc-page/70
            backdrop-blur-sm

            lg:hidden
          "
        />
      )}

      <aside
        aria-label="Security console sidebar"
        className={`
          fixed
          inset-y-0 left-0
          z-50

          flex
          h-screen
          h-dvh
          w-[280px]
          max-w-[calc(100vw-2rem)]
          min-w-0
          flex-col

          border-r border-soc-border
          bg-soc-page
          text-soc-text

          transition-transform
          duration-300
          ease-in-out

          lg:sticky
          lg:top-0
          lg:z-30
          lg:h-screen
          lg:h-dvh
          lg:w-[260px]
          lg:max-w-none
          lg:shrink-0
          lg:translate-x-0

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div
          className="
            flex
            h-16
            min-w-0
            shrink-0
            items-center
            justify-between
            gap-2

            border-b border-soc-border

            px-4

            sm:h-20
            sm:gap-3
            sm:px-5
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-1
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
                border border-soc-accent/20
                bg-soc-accent/10
              "
            >
              <ShieldAlert
                className="
                  h-5 w-5
                  text-soc-accent
                "
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-sm
                  font-bold
                  tracking-wide
                  text-soc-text
                "
              >
                AI SOC Analyst
              </p>

              <p
                className="
                  truncate
                  text-xs
                  text-soc-muted
                "
              >
                Security Operations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="
              flex
              h-9 w-9
              shrink-0
              items-center
              justify-center

              rounded-lg
              text-soc-muted
              transition-colors

              hover:bg-soc-panel
              hover:text-soc-text

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-soc-accent/50

              lg:hidden
            "
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Security console navigation"
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            overscroll-contain

            px-3
            py-4

            sm:py-6
          "
        >
          <p
            className="
              mb-3
              truncate
              px-3

              text-[11px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-soc-subtle
            "
          >
            Security Console
          </p>

          <div className="min-w-0 space-y-1">
            {visibleNavigationItems.map(
              (item) => {
                const Icon = item.icon;

                if (!item.enabled) {
                  return (
                    <div
                      key={item.path}
                      aria-disabled="true"
                      className="
                        flex
                        w-full
                        min-w-0
                        cursor-not-allowed
                        select-none
                        items-center
                        gap-3

                        rounded-xl
                        px-3
                        py-3

                        text-sm
                        font-medium
                        text-soc-subtle
                      "
                    >
                      <Icon
                        className="
                          h-5 w-5
                          shrink-0
                        "
                        aria-hidden="true"
                      />

                      <span
                        className="
                          min-w-0
                          flex-1
                          truncate
                        "
                      >
                        {item.label}
                      </span>

                      <span
                        className="
                          ml-auto
                          shrink-0

                          rounded-md
                          border border-soc-border

                          px-1.5
                          py-0.5

                          text-[9px]
                          uppercase
                          tracking-wider
                          text-soc-subtle
                        "
                      >
                        Soon
                      </span>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={
                      item.path ===
                      "/dashboard"
                    }
                    onClick={onClose}
                    className={({
                      isActive,
                    }) => `
                      flex
                      w-full
                      min-w-0
                      items-center
                      gap-3

                      rounded-xl
                      px-3
                      py-3

                      text-sm
                      font-medium

                      transition-colors
                      duration-200

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-soc-accent/50
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-soc-page

                      ${
                        isActive
                          ? `
                            bg-soc-accent/10
                            text-soc-accent
                          `
                          : `
                            text-soc-muted
                            hover:bg-soc-panel
                            hover:text-soc-text
                          `
                      }
                    `}
                  >
                    <Icon
                      className="
                        h-5 w-5
                        shrink-0
                      "
                      aria-hidden="true"
                    />

                    <span
                      className="
                        min-w-0
                        flex-1
                        truncate
                      "
                    >
                      {item.label}
                    </span>
                  </NavLink>
                );
              },
            )}
          </div>
        </nav>

        {/* User role */}
        {user?.role && (
          <div
            className="
              min-w-0
              shrink-0
              px-3
              pb-3

              sm:px-4
            "
          >
            <div
              className="
                min-w-0
                rounded-xl
                border border-soc-border
                bg-soc-panel/50

                px-3
                py-2
              "
            >
              <p
                className="
                  truncate
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-soc-subtle
                "
              >
                Signed in as
              </p>

              <p
                className="
                  mt-1
                  min-w-0
                  truncate

                  text-xs
                  font-semibold
                  text-soc-text-secondary
                "
                title={user.role}
              >
                {user.role
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(
                    /\b\w/g,
                    (character) =>
                      character.toUpperCase(),
                  )}
              </p>
            </div>
          </div>
        )}

        {/* System status */}
        <div
          className="
            min-w-0
            shrink-0

            border-t border-soc-border

            p-3

            sm:p-4
          "
        >
          <div
            className="
              min-w-0
              rounded-xl
              border border-soc-success/10
              bg-soc-success/5
              p-3
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-2 w-2
                  shrink-0
                  rounded-full
                  bg-soc-success
                "
              />

              <span
                className="
                  min-w-0
                  flex-1
                  truncate

                  text-xs
                  font-medium
                  text-soc-success
                "
              >
                SOC System Online
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}