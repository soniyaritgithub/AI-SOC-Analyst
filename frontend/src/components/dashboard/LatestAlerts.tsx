import {
  TriangleAlert,
} from "lucide-react";

import type {
  DashboardIncident,
} from "../../types/dashboard";

interface LatestAlertsProps {
  alerts?: DashboardIncident[] | null;
}

const severityClasses = {
  LOW: `
    border-soc-success/20
    bg-soc-success/10
    text-soc-success
  `,
  MEDIUM: `
    border-soc-warning/20
    bg-soc-warning/10
    text-soc-warning
  `,
  HIGH: `
    border-orange-500/20
    bg-orange-500/10
    text-orange-400
  `,
  CRITICAL: `
    border-soc-critical/20
    bg-soc-critical/10
    text-soc-critical
  `,
} as const;

export default function LatestAlerts({
  alerts,
}: LatestAlertsProps) {
  const safeAlerts =
    Array.isArray(alerts)
      ? alerts.filter(
          (
            alert,
          ): alert is DashboardIncident =>
            Boolean(alert) &&
            typeof alert === "object",
        )
      : [];

  return (
    <section
      className="
        w-full
        min-w-0
        max-w-full
        rounded-2xl
        border border-soc-border
        bg-soc-panel/60
        p-4

        sm:p-5
        xl:p-6
      "
    >
      {/* Header */}
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
            border border-soc-warning/20
            bg-soc-warning/10
          "
        >
          <TriangleAlert
            aria-hidden="true"
            className="
              h-5 w-5
              shrink-0
              text-soc-warning
            "
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2
            className="
              break-words
              text-base
              font-bold
              text-soc-text
            "
          >
            Latest Alerts
          </h2>

          <p
            className="
              mt-1
              break-words
              text-xs
              text-soc-muted
            "
          >
            Recent SOC activity
          </p>
        </div>
      </div>

      {/* Alerts */}
      <div
        className="
          mt-5
          w-full
          min-w-0
          max-w-full
          space-y-3
        "
      >
        {safeAlerts.length === 0 ? (
          <div
            className="
              min-w-0
              rounded-xl
              border
              border-dashed
              border-soc-border
              bg-soc-page/30
              px-4
              py-6
              text-center
            "
          >
            <TriangleAlert
              aria-hidden="true"
              className="
                mx-auto
                h-5 w-5
                text-soc-subtle
              "
            />

            <p
              className="
                mt-2
                break-words
                text-sm
                font-medium
                text-soc-muted
              "
            >
              No active alerts
            </p>

            <p
              className="
                mx-auto
                mt-1
                max-w-md
                break-words
                text-xs
                leading-5
                text-soc-subtle
              "
            >
              New security alerts will appear
              here.
            </p>
          </div>
        ) : (
          safeAlerts.map(
            (alert, index) => {
              const severity =
                alert.severity &&
                alert.severity in
                  severityClasses
                  ? alert.severity
                  : null;

              const title =
                typeof alert.title ===
                  "string" &&
                alert.title.trim()
                  ? alert.title
                  : "Untitled security alert";

              const incidentId =
                typeof alert.incident_id ===
                  "string" &&
                alert.incident_id.trim()
                  ? alert.incident_id
                  : "Unknown incident";

              const status =
                typeof alert.status ===
                  "string" &&
                alert.status.trim()
                  ? alert.status
                  : "UNKNOWN";

              const key =
                incidentId !==
                "Unknown incident"
                  ? incidentId
                  : `alert-${index}`;

              return (
                <article
                  key={key}
                  className="
                    w-full
                    min-w-0
                    max-w-full
                    rounded-xl
                    border border-soc-border
                    bg-soc-page/50
                    p-3
                    transition-colors
                    duration-200

                    hover:border-soc-subtle/50
                    hover:bg-soc-page/70

                    sm:p-4
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      flex-col
                      gap-3

                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                      sm:gap-4
                    "
                  >
                    {/* Alert information */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          max-w-full
                          break-words
                          text-sm
                          font-medium
                          leading-5
                          text-soc-text-secondary
                        "
                      >
                        {title}
                      </p>

                      <p
                        className="
                          mt-2
                          max-w-full
                          break-all
                          text-xs
                          text-soc-subtle
                        "
                      >
                        {incidentId}
                      </p>
                    </div>

                    {/* Alert badges */}
                    <div
                      className="
                        flex
                        min-w-0
                        max-w-full
                        shrink-0
                        flex-wrap
                        items-center
                        gap-2

                        sm:justify-end
                      "
                    >
                      <span
                        className="
                          max-w-full
                          break-words
                          rounded-md
                          border border-soc-border
                          bg-soc-panel
                          px-2
                          py-1
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-soc-muted
                        "
                      >
                        {status.replace(
                          /_/g,
                          " ",
                        )}
                      </span>

                      <span
                        className={`
                          max-w-full
                          break-words
                          rounded-md
                          border
                          px-2
                          py-1
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-wide

                          ${
                            severity
                              ? severityClasses[
                                  severity
                                ]
                              : `
                                  border-soc-border
                                  bg-soc-panel
                                  text-soc-muted
                                `
                          }
                        `}
                      >
                        {severity ?? "UNKNOWN"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            },
          )
        )}
      </div>
    </section>
  );
}