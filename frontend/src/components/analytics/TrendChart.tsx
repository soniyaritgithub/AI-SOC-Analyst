import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  IncidentTrend,
} from "../../types/analytics";

interface TrendChartProps {
  data: IncidentTrend[];
}

export default function TrendChart({
  data,
}: TrendChartProps) {
  const safeData = Array.isArray(data)
    ? data.filter(
        (item) =>
          item &&
          typeof item.month === "string" &&
          typeof item.count === "number" &&
          Number.isFinite(item.count) &&
          item.count >= 0,
      )
    : [];

  const hasData = safeData.length > 0;

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
          Monthly Incident Trends
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
          Incident activity over time.
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
            No trend data available.
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
            <LineChart
              data={safeData}
              margin={{
                top: 10,
                right: 8,
                left: -20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                minTickGap={24}
                tick={{
                  fontSize: 10,
                  fill: "#64748b",
                }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={36}
                tick={{
                  fontSize: 10,
                  fill: "#64748b",
                }}
              />

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
                  color: "#67e8f9",
                }}
                labelStyle={{
                  color: "#94a3b8",
                }}
              />

              <Line
                type="monotone"
                dataKey="count"
                name="Incidents"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{
                  r: 3,
                  fill: "#22d3ee",
                  stroke: "#0f172a",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: "#67e8f9",
                  stroke: "#0f172a",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}