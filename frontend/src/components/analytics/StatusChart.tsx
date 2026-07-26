import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  StatusDistribution,
} from "../../types/analytics";

interface StatusChartProps {
  data: StatusDistribution[];
}

function formatStatus(
  status: string,
): string {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function formatAxisStatus(
  status: string,
): string {
  if (status === "IN_PROGRESS") {
    return "Progress";
  }

  return formatStatus(status);
}

export default function StatusChart({
  data,
}: StatusChartProps) {
  const safeData = Array.isArray(data)
    ? data.filter(
        (item) =>
          item &&
          typeof item.status === "string" &&
          typeof item.count === "number" &&
          Number.isFinite(item.count) &&
          item.count >= 0,
      )
    : [];

  const chartData = safeData.map(
    (item) => ({
      ...item,
      label: formatStatus(item.status),
      axisLabel: formatAxisStatus(
        item.status,
      ),
    }),
  );

  const hasData = chartData.some(
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
          Incident Status
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
          Current incident workflow
          distribution.
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
            No status data available.
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
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 4,
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
                dataKey="axisLabel"
                axisLine={false}
                tickLine={false}
                interval={0}
                minTickGap={4}
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
                cursor={{
                  fill:
                    "rgba(30, 41, 59, 0.35)",
                }}
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
                labelFormatter={(
                  label,
                  payload,
                ) => {
                  const originalLabel =
                    payload?.[0]?.payload
                      ?.label;

                  return (
                    originalLabel ??
                    String(label)
                  );
                }}
              />

              <Bar
                dataKey="count"
                name="Incidents"
                fill="#22d3ee"
                radius={[6, 6, 0, 0]}
                maxBarSize={52}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}