import type {
  DashboardIncident,
} from "../../types/dashboard";

interface RecentIncidentsProps {
  incidents: DashboardIncident[];
}

const formatDate = (
  dateValue: string,
): string => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
};

export default function RecentIncidents({
  incidents,
}: RecentIncidentsProps) {
  return (
    <section
      className="
        h-full
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-2xl
        border border-soc-border
        bg-soc-panel/60
      "
    >
      {/* Header */}
      <div
        className="
          min-w-0
          border-b border-soc-border
          p-4

          sm:p-5
          xl:p-6
        "
      >
        <h2
          className="
            break-words
            text-base
            font-bold
            text-soc-text
          "
        >
          Recent Incidents
        </h2>

        <p
          className="
            mt-1
            break-words
            text-xs
            text-soc-muted
          "
        >
          Latest security incidents
        </p>
      </div>

      {/* Empty state */}
      {incidents.length === 0 ? (
        <div
          className="
            flex
            min-h-48
            min-w-0
            items-center
            justify-center
            p-4
            text-center

            sm:p-6
          "
        >
          <p
            className="
              break-words
              text-sm
              text-soc-muted
            "
          >
            No incidents available.
          </p>
        </div>
      ) : (
        /* Incident list */
        <div
          className="
            w-full
            min-w-0
            max-w-full
            divide-y
            divide-soc-border
          "
        >
          {incidents.map((incident) => (
            <div
              key={incident.incident_id}
              className="
                flex
                w-full
                min-w-0
                max-w-full
                flex-col
                gap-3
                p-4
                transition-colors
                duration-200

                hover:bg-soc-panel

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:gap-4
                sm:p-5
              "
            >
              {/* Incident information */}
              <div className="min-w-0 flex-1">
                <div
                  className="
                    flex
                    min-w-0
                    max-w-full
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      min-w-0
                      max-w-full
                      break-all
                      text-xs
                      font-semibold
                      text-soc-accent
                    "
                  >
                    {incident.incident_id}
                  </span>

                  <span
                    className="
                      max-w-full
                      break-words
                      rounded-md
                      border border-soc-border
                      px-2
                      py-0.5
                      text-[10px]
                      font-semibold
                      text-soc-text-secondary
                    "
                  >
                    {incident.severity}
                  </span>
                </div>

                <p
                  className="
                    mt-2
                    max-w-full
                    break-words
                    text-sm
                    font-medium
                    text-soc-text-secondary
                  "
                >
                  {incident.title}
                </p>

                <p
                  className="
                    mt-1
                    max-w-full
                    break-words
                    text-xs
                    text-soc-muted
                  "
                >
                  {formatDate(
                    incident.created_at,
                  )}
                </p>
              </div>

              {/* Incident status */}
              <span
                className="
                  w-fit
                  max-w-full
                  shrink-0
                  break-words
                  rounded-lg
                  border border-soc-border
                  bg-soc-panel
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-soc-text-secondary
                "
              >
                {incident.status.replaceAll(
                  "_",
                  " ",
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}