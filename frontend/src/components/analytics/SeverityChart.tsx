import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type {
  SeverityDistribution,
} from "../../types/analytics";

interface SeverityChartProps {
  data: SeverityDistribution[];
}

const SEVERITY_COLORS: Record<
  string,
  string
> = {
  CRITICAL: "#f87171",
  HIGH: "#fb923c",
  MEDIUM: "#f59e0b",
  LOW: "#10b981",
};

export default function SeverityChart({
  data,
}: SeverityChartProps) {
  const safeData = Array.isArray(data)
    ? data.filter(
        (item) =>
          item &&
          typeof item.severity ===
            "string" &&
          typeof item.count === "number" &&
          Number.isFinite(item.count) &&
          item.count >= 0,
      )
    : [];

  const hasData = safeData.some(
    (item) => item.count > 0,
  );

  return (
    <section
      className="
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-2xl
        border border-soc-border
        bg-soc-panel/60
        p-4

        sm:p-5
        lg:p-6
      "
    >
      {/* Header */}
      <div
        className="
          mb-5
          min-w-0
          max-w-full
        "
      >
        <h2
          className="
            max-w-full
            break-words
            text-base
            font-semibold
            text-soc-text

            sm:text-lg
          "
        >
          Severity Distribution
        </h2>

        <p
          className="
            mt-1
            max-w-full
            break-words
            text-xs
            leading-5
            text-soc-muted

            sm:text-sm
          "
        >
          Incidents grouped by security
          severity.
        </p>
      </div>

      {!hasData ? (
        <div
          className="
            flex
            h-64
            w-full
            min-w-0
            max-w-full
            items-center
            justify-center
            rounded-xl
            border
            border-dashed
            border-soc-border
            bg-soc-page/30
            px-4
            text-center

            sm:h-72
          "
        >
          <p
            className="
              max-w-full
              break-words
              text-sm
              text-soc-muted
            "
          >
            No severity data available.
          </p>
        </div>
      ) : (
        <div
          className="
            h-64
            w-full
            min-w-0
            max-w-full
            overflow-hidden

            sm:h-72
            lg:h-80
          "
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
          >
            <PieChart
              margin={{
                top: 4,
                right: 4,
                bottom: 4,
                left: 4,
              }}
            >
              <Pie
                data={safeData}
                dataKey="count"
                nameKey="severity"
                cx="50%"
                cy="43%"
                innerRadius="40%"
                outerRadius="65%"
                paddingAngle={3}
              >
                {safeData.map(
                  (entry, index) => (
                    <Cell
                      key={`${entry.severity}-${index}`}
                      fill={
                        SEVERITY_COLORS[
                          entry.severity
                        ] ?? "#64748b"
                      }
                      stroke="#0f172a"
                      strokeWidth={2}
                    />
                  ),
                )}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    "#020617",
                  border:
                    "1px solid #1e293b",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                  fontSize: "12px",
                  maxWidth: "220px",
                }}
                itemStyle={{
                  color: "#e2e8f0",
                }}
                labelStyle={{
                  color: "#94a3b8",
                }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  lineHeight: "18px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}