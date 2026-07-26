import {
  Activity,
  ShieldAlert,
  Siren,
  Users,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import LatestAlerts from "../components/dashboard/LatestAlerts";
import RecentIncidents from "../components/dashboard/RecentIncidents";
import SeverityOverview from "../components/dashboard/SeverityOverview";
import StatCard from "../components/dashboard/StatCard";

import ErrorState from "../components/ui/ErrorState";
import PageLoader from "../components/ui/PageLoader";

import {
  useDashboardSocket,
} from "../contexts/DashboardSocketContext";

import dashboardService from "../services/dashboard.service";

import type {
  DashboardSummary,
} from "../types/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardSummary | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const {
    liveDashboard,
    isLive,
  } = useDashboardSocket();

  const loadDashboard =
    useCallback(async () => {
      try {
        setError(null);

        const data =
          await dashboardService.getDashboard();

        setDashboard(data);
      } catch (requestError) {
        console.error(
          "Failed to load dashboard:",
          requestError,
        );

        setError(
          "Unable to load dashboard data. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  /*
   * Initial REST API load.
   */
  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  /*
   * Real-time dashboard updates come
   * from DashboardSocketProvider.
   */
  useEffect(() => {
    if (!liveDashboard) {
      return;
    }

    setDashboard(liveDashboard);
    setError(null);
    setIsLoading(false);
  }, [liveDashboard]);

  const handleRetry = () => {
    setIsLoading(true);
    void loadDashboard();
  };

  return (
    <DashboardLayout>
      <div
        className="
          w-full
          min-w-0
          max-w-full

          space-y-5

          sm:space-y-6
        "
      >
        {/* Page heading */}
        <div
          className="
            flex
            w-full
            min-w-0
            max-w-full
            flex-col
            gap-4

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div
            className="
              min-w-0
              flex-1
            "
          >
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
              Security Operations Center
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
              Security Overview
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
              Monitor incidents, threats and
              SOC activity in real time.
            </p>
          </div>

          {/* WebSocket status */}
          <div
            className="
              flex
              w-fit
              max-w-full
              shrink-0
              items-center
              gap-2

              rounded-full
              border border-soc-border
              bg-soc-panel

              px-3
              py-2
            "
          >
            <span
              aria-hidden="true"
              className={`
                h-2 w-2
                shrink-0
                rounded-full

                ${
                  isLive
                    ? "bg-soc-success"
                    : "bg-soc-warning"
                }
              `}
            />

            <span
              className="
                min-w-0
                truncate
                text-xs
                font-medium
                text-soc-text-secondary
              "
            >
              {isLive
                ? "Live monitoring"
                : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Global loading state */}
        {isLoading && (
          <div className="min-w-0">
            <PageLoader message="Loading SOC dashboard..." />
          </div>
        )}

        {/* Global error state */}
        {!isLoading && error && (
          <div className="min-w-0">
            <ErrorState
              title="Dashboard unavailable"
              message={error}
              onRetry={handleRetry}
              isRetrying={isLoading}
            />
          </div>
        )}

        {/* Dashboard content */}
        {!isLoading &&
          !error &&
          dashboard && (
            <div
              className="
                w-full
                min-w-0
                max-w-full

                space-y-5

                sm:space-y-6
              "
            >
              {/* Statistics */}
              <div
                className="
                  grid
                  w-full
                  min-w-0
                  grid-cols-1
                  gap-4

                  sm:grid-cols-2

                  xl:grid-cols-4
                "
              >
                <div className="min-w-0">
                  <StatCard
                    title="Total Incidents"
                    value={
                      dashboard.total_incidents
                    }
                    description="All recorded security incidents"
                    icon={Activity}
                  />
                </div>

                <div className="min-w-0">
                  <StatCard
                    title="Open Incidents"
                    value={
                      dashboard.open_incidents
                    }
                    description="Incidents requiring attention"
                    icon={ShieldAlert}
                  />
                </div>

                <div className="min-w-0">
                  <StatCard
                    title="Critical"
                    value={
                      dashboard.critical_incidents
                    }
                    description="Critical priority incidents"
                    icon={Siren}
                  />
                </div>

                <div className="min-w-0">
                  <StatCard
                    title="Active Analysts"
                    value={
                      dashboard.active_analysts
                    }
                    description="Active SOC team members"
                    icon={Users}
                  />
                </div>
              </div>

              {/* Main widgets */}
              <div
                className="
                  grid
                  w-full
                  min-w-0
                  grid-cols-1
                  gap-5

                  sm:gap-6

                  xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)]
                "
              >
                <div
                  className="
                    w-full
                    min-w-0
                    max-w-full
                  "
                >
                  <RecentIncidents
                    incidents={
                      dashboard.recent_incidents
                    }
                  />
                </div>

                <div
                  className="
                    w-full
                    min-w-0
                    max-w-full
                  "
                >
                  <SeverityOverview
                    data={dashboard}
                  />
                </div>
              </div>

              {/* Latest alerts */}
              <div
                className="
                  w-full
                  min-w-0
                  max-w-full
                "
              >
                <LatestAlerts
                  alerts={
                    dashboard.latest_alerts
                  }
                />
              </div>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}