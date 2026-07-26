import {
  ChevronRight,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  Incident,
} from "../../types/incident";

import SeverityBadge from "./SeverityBadge";
import StatusBadge from "./StatusBadge";

interface IncidentTableProps {
  incidents: Incident[];
}

const formatDate = (
  value: string,
): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
};

export default function IncidentTable({
  incidents,
}: IncidentTableProps) {
  const navigate = useNavigate();

  return (
    <div
      className="
        hidden
        w-full
        min-w-0
        max-w-full
        rounded-2xl
        border border-soc-border
        bg-soc-panel/60

        md:block
      "
    >
      {/*
       * Intentional horizontal scrolling:
       * the table keeps a readable minimum
       * width while its parent remains
       * constrained to the page width.
       */}
      <div
        className="
          w-full
          min-w-0
          max-w-full
          overflow-x-auto
          overscroll-x-contain
          rounded-2xl
        "
      >
        <table
          className="
            w-full
            min-w-[850px]
            border-collapse
          "
        >
          <thead
            className="
              border-b border-soc-border
              bg-soc-page/50
            "
          >
            <tr>
              <th
                scope="col"
                className="
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-soc-muted
                "
              >
                Incident
              </th>

              <th
                scope="col"
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-soc-muted
                "
              >
                Severity
              </th>

              <th
                scope="col"
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-soc-muted
                "
              >
                Status
              </th>

              <th
                scope="col"
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-soc-muted
                "
              >
                Created
              </th>

              <th
                scope="col"
                className="
                  w-16
                  px-5
                  py-4
                "
              >
                <span className="sr-only">
                  View incident
                </span>
              </th>
            </tr>
          </thead>

          <tbody
            className="
              divide-y
              divide-soc-border
            "
          >
            {incidents.map((incident) => (
              <tr
                key={incident.id}
                onClick={() =>
                  navigate(
                    `/incidents/${incident.id}`,
                  )
                }
                className="
                  cursor-pointer
                  transition-colors
                  duration-200

                  hover:bg-soc-panel
                "
              >
                <td
                  className="
                    min-w-0
                    px-5
                    py-4
                  "
                >
                  <div
                    className="
                      min-w-0
                      max-w-md
                    "
                  >
                    <p
                      className="
                        max-w-full
                        break-all
                        text-xs
                        font-semibold
                        text-soc-accent
                      "
                      title={
                        incident.incident_id
                      }
                    >
                      {incident.incident_id}
                    </p>

                    <p
                      className="
                        mt-1
                        max-w-md
                        truncate
                        text-sm
                        font-medium
                        text-soc-text-secondary
                      "
                      title={incident.title}
                    >
                      {incident.title}
                    </p>
                  </div>
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-5
                    py-4
                  "
                >
                  <SeverityBadge
                    severity={
                      incident.severity
                    }
                  />
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-5
                    py-4
                  "
                >
                  <StatusBadge
                    status={incident.status}
                  />
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-5
                    py-4
                    text-sm
                    text-soc-muted
                  "
                >
                  {formatDate(
                    incident.created_at,
                  )}
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-5
                    py-4
                  "
                >
                  <ChevronRight
                    aria-hidden="true"
                    className="
                      h-5
                      w-5
                      shrink-0
                      text-soc-subtle
                    "
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}