import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldAlert,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import SeverityChart from "../components/analytics/SeverityChart";
import StatusChart from "../components/analytics/StatusChart";
import TrendChart from "../components/analytics/TrendChart";

import ErrorState from "../components/ui/ErrorState";

import DashboardLayout from "../layouts/DashboardLayout";

import analyticsService from "../services/analytics.service";

import type {
  AnalyticsData,
} from "../types/analytics";

const EMPTY_ANALYTICS: AnalyticsData = {
  statistics: {
    total_incidents: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  },
  severity: [],
  status: [],
  trends: [],
};

const formatStatistic = (
  value: number,
): string => {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Math.max(
    0,
    value,
  ).toLocaleString();
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] =
    useState<AnalyticsData>(
      EMPTY_ANALYTICS,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadAnalytics =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await analyticsService.getAnalytics();

        setAnalytics(data);
      } catch (requestError) {
        console.error(
          "Failed to load analytics:",
          requestError,
        );

        setError(
          "Unable to load analytics data. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const statistics =
    analytics.statistics;

  const cards = [
    {
      label: "Total Incidents",
      value:
        statistics.total_incidents,
      icon: ShieldAlert,
    },
    {
      label: "Open Incidents",
      value: statistics.open,
      icon: AlertTriangle,
    },
    {
      label: "In Progress",
      value:
        statistics.in_progress,
      icon: Clock3,
    },
    {
      label: "Resolved",
      value: statistics.resolved,
      icon: CheckCircle2,
    },
  ];

  const handleRetry = () => {
    void loadAnalytics();
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
        <header
          className="
            w-full
            min-w-0
            max-w-full
          "
        >
          <p
            className="
              max-w-full
              break-words
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-soc-accent
            "
          >
            SOC Intelligence
          </p>

          <h1
            className="
              mt-2
              max-w-full
              break-words
              text-2xl
              font-bold
              tracking-tight
              text-soc-text

              sm:text-3xl
            "
          >
            Security Analytics
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              break-words
              text-sm
              leading-6
              text-soc-muted

              sm:text-base
            "
          >
            Monitor incident trends,
            severity and response status.
          </p>
        </header>

        {/* Error */}
        {!isLoading && error && (
          <div
            className="
              w-full
              min-w-0
              max-w-full
            "
          >
            <ErrorState
              title="Analytics unavailable"
              message={error}
              onRetry={handleRetry}
              isRetrying={isLoading}
            />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <AnalyticsSkeleton />
        )}

        {/* Analytics content */}
        {!isLoading && !error && (
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
            <section
              aria-label="Incident statistics"
              className="
                grid
                w-full
                min-w-0
                max-w-full
                grid-cols-1
                gap-4

                sm:grid-cols-2
                xl:grid-cols-4
              "
            >
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.label}
                    className="
                      flex
                      h-full
                      w-full
                      min-w-0
                      max-w-full
                      flex-col
                      rounded-2xl
                      border border-soc-border
                      bg-soc-panel/60
                      p-4
                      transition-colors
                      duration-200

                      hover:border-soc-subtle/50
                      hover:bg-soc-panel

                      sm:p-5
                      lg:p-6
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        max-w-full
                        items-start
                        justify-between
                        gap-3

                        sm:gap-4
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
                            max-w-full
                            break-words
                            text-sm
                            font-medium
                            text-soc-muted
                          "
                        >
                          {card.label}
                        </p>

                        <p
                          className="
                            mt-3
                            max-w-full
                            break-words
                            [overflow-wrap:anywhere]
                            text-2xl
                            font-bold
                            tracking-tight
                            text-soc-text

                            sm:text-3xl
                          "
                        >
                          {formatStatistic(
                            card.value,
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-soc-accent/20
                          bg-soc-accent/10

                          sm:h-11
                          sm:w-11
                        "
                      >
                        <Icon
                          className="
                            h-5
                            w-5
                            shrink-0
                            text-soc-accent
                          "
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Severity + status */}
            <section
              aria-label="Incident distribution charts"
              className="
                grid
                w-full
                min-w-0
                max-w-full
                grid-cols-1
                gap-5

                sm:gap-6
                xl:grid-cols-2
              "
            >
              <div
                className="
                  w-full
                  min-w-0
                  max-w-full
                  overflow-hidden
                "
              >
                <SeverityChart
                  data={
                    analytics.severity
                  }
                />
              </div>

              <div
                className="
                  w-full
                  min-w-0
                  max-w-full
                  overflow-hidden
                "
              >
                <StatusChart
                  data={
                    analytics.status
                  }
                />
              </div>
            </section>

            {/* Trend */}
            <section
              aria-label="Incident trend chart"
              className="
                w-full
                min-w-0
                max-w-full
                overflow-hidden
              "
            >
              <TrendChart
                data={analytics.trends}
              />
            </section>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function AnalyticsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading security analytics"
      className="
        w-full
        min-w-0
        max-w-full
        space-y-5

        sm:space-y-6
      "
    >
      {/* Statistics skeleton */}
      <div
        className="
          grid
          w-full
          min-w-0
          max-w-full
          grid-cols-1
          gap-4

          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="
              h-28
              w-full
              min-w-0
              max-w-full
              animate-pulse
              rounded-2xl
              border border-soc-border
              bg-soc-panel/60

              sm:h-32
            "
          />
        ))}
      </div>

      {/* Distribution chart skeletons */}
      <div
        className="
          grid
          w-full
          min-w-0
          max-w-full
          grid-cols-1
          gap-5

          sm:gap-6
          xl:grid-cols-2
        "
      >
        {Array.from({
          length: 2,
        }).map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="
              h-72
              w-full
              min-w-0
              max-w-full
              animate-pulse
              overflow-hidden
              rounded-2xl
              border border-soc-border
              bg-soc-panel/60

              sm:h-80
              lg:h-96
            "
          />
        ))}
      </div>

      {/* Trend chart skeleton */}
      <div
        aria-hidden="true"
        className="
          h-72
          w-full
          min-w-0
          max-w-full
          animate-pulse
          overflow-hidden
          rounded-2xl
          border border-soc-border
          bg-soc-panel/60

          sm:h-80
          lg:h-96
        "
      />

      <span className="sr-only">
        Loading analytics data...
      </span>
    </div>
  );
}