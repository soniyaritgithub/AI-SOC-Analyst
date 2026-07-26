import type {
  DashboardSummary,
} from "../../types/dashboard";

interface SeverityOverviewProps {
  data: DashboardSummary;
}

const severityConfig = [
  {
    key: "critical_incidents",
    label: "Critical",
    barClassName: "bg-soc-critical",
    textClassName: "text-soc-critical",
  },
  {
    key: "high_incidents",
    label: "High",
    barClassName: "bg-orange-400",
    textClassName: "text-orange-400",
  },
  {
    key: "medium_incidents",
    label: "Medium",
    barClassName: "bg-soc-warning",
    textClassName: "text-soc-warning",
  },
  {
    key: "low_incidents",
    label: "Low",
    barClassName: "bg-soc-success",
    textClassName: "text-soc-success",
  },
] as const;

export default function SeverityOverview({
  data,
}: SeverityOverviewProps) {
  const total =
    data.critical_incidents +
    data.high_incidents +
    data.medium_incidents +
    data.low_incidents;

  return (
    <section
      className="
        h-full
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
      <div className="min-w-0">
        <h2
          className="
            break-words
            text-base
            font-bold
            text-soc-text
          "
        >
          Severity Overview
        </h2>

        <p
          className="
            mt-1
            break-words
            text-xs
            text-soc-muted
          "
        >
          Current incident distribution
        </p>
      </div>

      {/* Severity distribution */}
      <div
        className="
          mt-5
          min-w-0
          space-y-5

          sm:mt-6
        "
      >
        {severityConfig.map(
          ({
            key,
            label,
            barClassName,
            textClassName,
          }) => {
            const rawValue = data[key];

            const value =
              typeof rawValue === "number" &&
              Number.isFinite(rawValue)
                ? Math.max(0, rawValue)
                : 0;

            const percentage =
              total > 0
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      Math.round(
                        (value / total) * 100,
                      ),
                    ),
                  )
                : 0;

            return (
              <div
                key={key}
                className="
                  w-full
                  min-w-0
                  max-w-full
                "
              >
                <div
                  className="
                    mb-2
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-3

                    sm:gap-4
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                      gap-2
                    "
                  >
                    <span
                      aria-hidden="true"
                      className={`
                        h-2 w-2
                        shrink-0
                        rounded-full
                        ${barClassName}
                      `}
                    />

                    <span
                      className="
                        min-w-0
                        truncate
                        text-sm
                        font-medium
                        text-soc-text-secondary
                      "
                    >
                      {label}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className={`
                        whitespace-nowrap
                        text-xs
                        font-medium
                        ${textClassName}
                      `}
                    >
                      {percentage}%
                    </span>

                    <span
                      className="
                        whitespace-nowrap
                        text-sm
                        font-semibold
                        text-soc-text
                      "
                    >
                      {value.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div
                  className="
                    h-2
                    w-full
                    max-w-full
                    overflow-hidden
                    rounded-full
                    bg-soc-border
                  "
                  role="progressbar"
                  aria-label={`${label} incidents`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                >
                  <div
                    className={`
                      h-full
                      max-w-full
                      rounded-full
                      transition-[width]
                      duration-500
                      ${barClassName}
                    `}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}