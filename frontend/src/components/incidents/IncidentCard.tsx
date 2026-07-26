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

interface IncidentCardProps {
  incident: Incident;
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

export default function IncidentCard({
  incident,
}: IncidentCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/incidents/${incident.id}`,
        )
      }
      className="
        block
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-2xl
        border border-soc-border
        bg-soc-panel/60
        p-4
        text-left
        transition-colors
        duration-200

        hover:border-soc-subtle/50
        hover:bg-soc-panel

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-soc-accent/50
        focus-visible:ring-offset-2
        focus-visible:ring-offset-soc-page

        sm:p-5
      "
    >
      {/* Incident heading */}
      <div
        className="
          flex
          w-full
          min-w-0
          max-w-full
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className="
            min-w-0
            max-w-full
            flex-1
          "
        >
          <p
            className="
              max-w-full
              break-all
              text-xs
              font-semibold
              leading-5
              text-soc-accent
            "
            title={incident.incident_id}
          >
            {incident.incident_id}
          </p>

          <h3
            className="
              mt-2
              max-w-full
              break-words
              text-sm
              font-semibold
              leading-5
              text-soc-text
            "
          >
            {incident.title}
          </h3>
        </div>

        <ChevronRight
          aria-hidden="true"
          className="
            mt-1
            h-5
            w-5
            shrink-0
            text-soc-subtle
            transition-transform
            duration-200
          "
        />
      </div>

      {/* Severity and status */}
      <div
        className="
          mt-4
          flex
          w-full
          min-w-0
          max-w-full
          flex-wrap
          items-center
          gap-2
        "
      >
        <div className="max-w-full">
          <SeverityBadge
            severity={incident.severity}
          />
        </div>

        <div className="max-w-full">
          <StatusBadge
            status={incident.status}
          />
        </div>
      </div>

      {/* Created date */}
      <div
        className="
          mt-4
          w-full
          min-w-0
          max-w-full
          border-t
          border-soc-border
          pt-3
        "
      >
        <p
          className="
            text-xs
            text-soc-muted
          "
        >
          Created
        </p>

        <p
          className="
            mt-1
            max-w-full
            break-words
            text-xs
            leading-5
            text-soc-text-secondary
          "
        >
          {formatDate(
            incident.created_at,
          )}
        </p>
      </div>
    </button>
  );
}