import {
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import incidentService from "../services/incident.service";

import type {
  AssignmentAnalyst,
  IncidentDetail,
  IncidentStatus,
} from "../types/incident";

const STATUS_OPTIONS: IncidentStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const formatStatus = (
  status: IncidentStatus,
): string => {
  return status.replaceAll("_", " ");
};

const formatDate = (
  value?: string,
): string => {
  if (!value) {
    return "—";
  }

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

export default function IncidentDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [incident, setIncident] =
    useState<IncidentDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [analysts, setAnalysts] =
    useState<AssignmentAnalyst[]>([]);

  const [
    selectedAnalystId,
    setSelectedAnalystId,
  ] = useState("");

  const [
    loadingAnalysts,
    setLoadingAnalysts,
  ] = useState(false);

  const [
    assigningAnalyst,
    setAssigningAnalyst,
  ] = useState(false);

  useEffect(() => {
    const loadIncident = async () => {
      if (!id) {
        setError("Invalid incident ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await incidentService.getIncident(
            id,
          );

        setIncident(data);
      } catch {
        setError(
          "Unable to load incident details.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadIncident();
  }, [id]);

  useEffect(() => {
    const loadAnalysts = async () => {
      try {
        setLoadingAnalysts(true);

        const data =
          await incidentService.getAssignmentAnalysts();

        setAnalysts(data);
      } catch {
        setAnalysts([]);
      } finally {
        setLoadingAnalysts(false);
      }
    };

    void loadAnalysts();
  }, []);

  const handleStatusChange = async (
    newStatus: IncidentStatus,
  ) => {
    if (
      !id ||
      !incident ||
      newStatus === incident.status ||
      updatingStatus
    ) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const updatedIncident =
        await incidentService.changeStatus(
          id,
          newStatus,
        );

      setIncident(updatedIncident);
    } catch {
      setError(
        "Unable to update incident status. Admin or Manager permission may be required.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignAnalyst = async () => {
    if (
      !id ||
      !selectedAnalystId ||
      assigningAnalyst
    ) {
      return;
    }

    try {
      setAssigningAnalyst(true);
      setError("");

      const updatedIncident =
        await incidentService.assignAnalyst(
          id,
          selectedAnalystId,
        );

      setIncident(updatedIncident);
      setSelectedAnalystId("");
    } catch {
      setError(
        "Unable to assign analyst. Admin or Manager permission may be required.",
      );
    } finally {
      setAssigningAnalyst(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div
          className="
            flex
            min-h-[50vh]
            w-full
            min-w-0
            max-w-full
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              flex
              min-w-0
              max-w-full
              items-center
              justify-center
              gap-3
              text-sm
              text-soc-muted
            "
          >
            <LoaderCircle
              aria-hidden="true"
              className="
                h-5
                w-5
                shrink-0
                animate-spin
                text-soc-accent
              "
            />

            <span className="break-words">
              Loading incident...
            </span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!incident) {
    return (
      <DashboardLayout>
        <div
          className="
            mx-auto
            w-full
            min-w-0
            max-w-2xl
          "
        >
          <div
            role="alert"
            className="
              w-full
              min-w-0
              max-w-full
              rounded-2xl
              border
              border-soc-critical/20
              bg-soc-critical/10
              p-4

              sm:p-5
            "
          >
            <p
              className="
                max-w-full
                break-words
                [overflow-wrap:anywhere]
                text-sm
                leading-6
                text-soc-critical
              "
            >
              {error ||
                "Incident not found."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/incidents")
              }
              className="
                mt-4
                inline-flex
                min-h-10
                max-w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border border-soc-border
                bg-soc-panel
                px-4
                py-2
                text-sm
                font-medium
                text-soc-text
                transition-colors

                hover:border-soc-subtle/50

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-soc-accent/50
              "
            >
              <ArrowLeft
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  shrink-0
                "
              />

              <span className="break-words">
                Back to incidents
              </span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
        {/* Header */}
        <div
          className="
            flex
            w-full
            min-w-0
            max-w-full
            flex-col
            gap-4

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div
            className="
              min-w-0
              max-w-full
              flex-1
            "
          >
            <button
              type="button"
              onClick={() =>
                navigate("/incidents")
              }
              className="
                mb-3
                inline-flex
                max-w-full
                items-center
                gap-2
                rounded-lg
                text-sm
                font-medium
                text-soc-accent
                transition-colors

                hover:text-cyan-300

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-soc-accent/50
              "
            >
              <ArrowLeft
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  shrink-0
                "
              />

              <span className="break-words">
                Back to incidents
              </span>
            </button>

            <p
              className="
                max-w-full
                break-all
                text-xs
                font-semibold
                uppercase
                leading-5
                tracking-[0.18em]
                text-soc-accent
              "
              title={incident.incident_id}
            >
              {incident.incident_id}
            </p>

            <h1
              className="
                mt-2
                max-w-full
                break-words
                [overflow-wrap:anywhere]
                text-xl
                font-bold
                tracking-tight
                text-soc-text

                sm:text-2xl
                lg:text-3xl
              "
            >
              {incident.title}
            </h1>
          </div>

          {/* Status control */}
          <div
            className="
              w-full
              min-w-0
              max-w-full

              sm:max-w-xs

              lg:w-auto
              lg:min-w-52
              lg:shrink-0
            "
          >
            <label
              htmlFor="incident-status"
              className="
                mb-2
                block
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-soc-muted
              "
            >
              Status
            </label>

            <select
              id="incident-status"
              value={incident.status}
              disabled={updatingStatus}
              onChange={(event) => {
                void handleStatusChange(
                  event.target
                    .value as IncidentStatus,
                );
              }}
              className="
                h-11
                w-full
                min-w-0
                max-w-full
                rounded-xl
                border border-soc-border
                bg-soc-panel
                px-3
                text-base
                text-soc-text
                outline-none
                transition-colors

                focus:border-soc-accent/50
                focus:ring-2
                focus:ring-soc-accent/10

                disabled:cursor-not-allowed
                disabled:opacity-60

                sm:text-sm
              "
            >
              {STATUS_OPTIONS.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(status)}
                  </option>
                ),
              )}
            </select>

            {updatingStatus && (
              <p
                className="
                  mt-2
                  break-words
                  text-xs
                  text-soc-muted
                "
              >
                Updating status...
              </p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="
              w-full
              min-w-0
              max-w-full
              rounded-xl
              border
              border-soc-critical/20
              bg-soc-critical/10
              p-4
              text-sm
              leading-6
              text-soc-critical
            "
          >
            <p
              className="
                max-w-full
                break-words
                [overflow-wrap:anywhere]
              "
            >
              {error}
            </p>
          </div>
        )}

        {/* Incident summary */}
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
          <InfoCard
            label="Severity"
            value={incident.severity}
          />

          <InfoCard
            label="Status"
            value={formatStatus(
              incident.status,
            )}
          />

          <InfoCard
            label="Assigned Analyst"
            value={
              incident.assigned_to ||
              "Unassigned"
            }
          />

          <InfoCard
            label="Created By"
            value={
              incident.created_by ||
              "Unknown"
            }
          />
        </div>

        {/* Analyst assignment */}
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
            lg:p-6
          "
        >
          <div className="min-w-0 max-w-full">
            <h2
              className="
                break-words
                text-base
                font-semibold
                text-soc-text

                sm:text-lg
              "
            >
              Analyst Assignment
            </h2>

            <p
              className="
                mt-1
                max-w-full
                break-words
                text-sm
                leading-6
                text-soc-muted
              "
            >
              Assign this incident to an
              active SOC analyst.
            </p>
          </div>

          <div
            className="
              mt-5
              flex
              w-full
              min-w-0
              max-w-full
              flex-col
              gap-3

              sm:flex-row
              sm:items-end
            "
          >
            <div
              className="
                w-full
                min-w-0
                max-w-full
                flex-1
              "
            >
              <label
                htmlFor="analyst"
                className="
                  mb-2
                  block
                  text-xs
                  font-medium
                  uppercase
                  tracking-wide
                  text-soc-muted
                "
              >
                SOC Analyst
              </label>

              <select
                id="analyst"
                value={selectedAnalystId}
                disabled={
                  loadingAnalysts ||
                  assigningAnalyst
                }
                onChange={(event) =>
                  setSelectedAnalystId(
                    event.target.value,
                  )
                }
                className="
                  h-11
                  w-full
                  min-w-0
                  max-w-full
                  rounded-xl
                  border border-soc-border
                  bg-soc-page
                  px-3
                  text-base
                  text-soc-text
                  outline-none
                  transition-colors

                  focus:border-soc-accent/50
                  focus:ring-2
                  focus:ring-soc-accent/10

                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  sm:text-sm
                "
              >
                <option value="">
                  {loadingAnalysts
                    ? "Loading analysts..."
                    : "Select analyst"}
                </option>

                {analysts.map(
                  (analyst) => (
                    <option
                      key={analyst.id}
                      value={analyst.id}
                    >
                      {analyst.full_name ||
                        analyst.email}
                    </option>
                  ),
                )}
              </select>
            </div>

            <button
              type="button"
              disabled={
                !selectedAnalystId ||
                assigningAnalyst
              }
              onClick={() => {
                void handleAssignAnalyst();
              }}
              className="
                inline-flex
                min-h-11
                w-full
                min-w-0
                max-w-full
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-soc-accent
                px-5
                py-2.5
                text-sm
                font-semibold
                text-soc-page
                transition-colors

                hover:bg-cyan-400

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-soc-accent/50
                focus-visible:ring-offset-2
                focus-visible:ring-offset-soc-panel

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:w-auto
              "
            >
              {assigningAnalyst && (
                <LoaderCircle
                  aria-hidden="true"
                  className="
                    h-4
                    w-4
                    shrink-0
                    animate-spin
                  "
                />
              )}

              <span className="break-words">
                {assigningAnalyst
                  ? "Assigning..."
                  : "Assign Analyst"}
              </span>
            </button>
          </div>

          <div
            className="
              mt-4
              w-full
              min-w-0
              max-w-full
              rounded-xl
              border border-soc-border
              bg-soc-page/50
              p-3
            "
          >
            <p
              className="
                text-xs
                text-soc-muted
              "
            >
              Currently assigned
            </p>

            <p
              className="
                mt-1
                max-w-full
                break-words
                [overflow-wrap:anywhere]
                text-sm
                font-medium
                text-soc-text-secondary
              "
            >
              {incident.assigned_to ||
                "No analyst assigned"}
            </p>
          </div>
        </section>

        {/* Investigation */}
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
            lg:p-6
          "
        >
          <h2
            className="
              break-words
              text-base
              font-semibold
              text-soc-text

              sm:text-lg
            "
          >
            Investigation Details
          </h2>

          <p
            className="
              mt-4
              max-w-full
              whitespace-pre-wrap
              break-words
              [overflow-wrap:anywhere]
              text-sm
              leading-6
              text-soc-text-secondary
            "
          >
            {incident.description ||
              "No description available."}
          </p>
        </section>

        {/* Timestamps */}
        <section
          aria-label="Incident timestamps"
          className="
            grid
            w-full
            min-w-0
            max-w-full
            grid-cols-1
            gap-4

            md:grid-cols-2
          "
        >
          <InfoCard
            label="Created At"
            value={formatDate(
              incident.created_at,
            )}
          />

          <InfoCard
            label="Last Updated"
            value={formatDate(
              incident.updated_at,
            )}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}

interface InfoCardProps {
  label: string;
  value: string;
}

function InfoCard({
  label,
  value,
}: InfoCardProps) {
  return (
    <div
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
      "
    >
      <p
        className="
          max-w-full
          break-words
          text-xs
          font-medium
          uppercase
          tracking-wide
          text-soc-muted
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          max-w-full
          break-words
          [overflow-wrap:anywhere]
          text-sm
          font-semibold
          leading-6
          text-soc-text

          sm:text-base
        "
      >
        {value}
      </p>
    </div>
  );
}