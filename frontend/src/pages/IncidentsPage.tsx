import {
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import IncidentCard from "../components/incidents/IncidentCard";
import IncidentPagination from "../components/incidents/IncidentPagination";
import IncidentTable from "../components/incidents/IncidentTable";

import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import PageLoader from "../components/ui/PageLoader";

import incidentService from "../services/incident.service";

import type {
  Incident,
  IncidentSeverity,
  IncidentStatus,
} from "../types/incident";

export default function IncidentsPage() {
  const [incidents, setIncidents] =
    useState<Incident[]>([]);

  const [search, setSearch] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [severity, setSeverity] =
    useState<IncidentSeverity | "">("");

  const [status, setStatus] =
    useState<IncidentStatus | "">("");

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [hasNext, setHasNext] =
    useState(false);

  const [
    hasPrevious,
    setHasPrevious,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Debounce search input so the API
   * is not called on every keystroke.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  const loadIncidents =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await incidentService.getIncidents({
            page,
            search: debouncedSearch,
            severity,
            status,
          });

        setIncidents(response.results);
        setTotal(response.count);

        setHasNext(
          Boolean(response.next),
        );

        setHasPrevious(
          Boolean(response.previous),
        );
      } catch (requestError) {
        console.error(
          "Failed to load incidents:",
          requestError,
        );

        setIncidents([]);
        setTotal(0);
        setHasNext(false);
        setHasPrevious(false);

        setError(
          "Unable to load incidents. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      page,
      debouncedSearch,
      severity,
      status,
    ]);

  useEffect(() => {
    void loadIncidents();
  }, [loadIncidents]);

  const handleSeverityChange = (
    value: IncidentSeverity | "",
  ) => {
    setSeverity(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: IncidentStatus | "",
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleRetry = () => {
    void loadIncidents();
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
          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
                text-soc-accent
              "
            >
              <ShieldAlert
                className="
                  h-4 w-4
                  shrink-0
                "
                aria-hidden="true"
              />

              <p
                className="
                  min-w-0
                  break-words
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                "
              >
                Incident Management
              </p>
            </div>

            <h2
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
              Security Incidents
            </h2>

            <p
              className="
                mt-2
                max-w-2xl
                break-words
                text-sm
                leading-6
                text-soc-muted
              "
            >
              Monitor, search and investigate
              security incidents detected by
              the SOC platform.
            </p>
          </div>

          {/* Refresh */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              void loadIncidents();
            }}
            className="
              inline-flex
              min-h-11
              w-full
              max-w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              border border-soc-border
              bg-soc-panel
              px-4
              py-2.5
              text-sm
              font-medium
              text-soc-text-secondary
              transition-colors
              duration-200

              hover:border-soc-subtle/50
              hover:bg-soc-panel
              hover:text-soc-text

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-soc-accent/50
              focus-visible:ring-offset-2
              focus-visible:ring-offset-soc-page

              disabled:cursor-not-allowed
              disabled:opacity-50

              sm:w-fit
            "
          >
            <RefreshCw
              className={`
                h-4 w-4
                shrink-0

                ${
                  isLoading
                    ? "animate-spin"
                    : ""
                }
              `}
              aria-hidden="true"
            />

            <span className="truncate">
              {isLoading
                ? "Refreshing..."
                : "Refresh"}
            </span>
          </button>
        </div>

        {/* Filters */}
        <section
          aria-label="Incident filters"
          className="
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
          <div
            className="
              grid
              w-full
              min-w-0
              max-w-full
              grid-cols-1
              gap-3

              md:grid-cols-2

              xl:grid-cols-[minmax(0,1fr)_minmax(0,220px)_minmax(0,220px)]
            "
          >
            {/* Search */}
            <div
              className="
                relative
                min-w-0
                max-w-full

                md:col-span-2
                xl:col-span-1
              "
            >
              <Search
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4 w-4
                  shrink-0
                  -translate-y-1/2
                  text-soc-muted
                "
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search incidents..."
                aria-label="Search incidents"
                className="
                  h-11
                  w-full
                  min-w-0
                  max-w-full
                  rounded-xl
                  border border-soc-border
                  bg-soc-page
                  pl-10
                  pr-4
                  text-base
                  text-soc-text
                  outline-none
                  transition-colors
                  duration-200

                  placeholder:text-soc-subtle

                  focus:border-soc-accent/50
                  focus:ring-2
                  focus:ring-soc-accent/10

                  sm:text-sm
                "
              />
            </div>

            {/* Severity */}
            <select
              value={severity}
              onChange={(event) =>
                handleSeverityChange(
                  event.target
                    .value as
                    | IncidentSeverity
                    | "",
                )
              }
              aria-label="Filter by severity"
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
                text-soc-text-secondary
                outline-none
                transition-colors
                duration-200

                focus:border-soc-accent/50
                focus:ring-2
                focus:ring-soc-accent/10

                sm:text-sm
              "
            >
              <option value="">
                All Severities
              </option>

              <option value="CRITICAL">
                Critical
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="LOW">
                Low
              </option>
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target
                    .value as
                    | IncidentStatus
                    | "",
                )
              }
              aria-label="Filter by status"
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
                text-soc-text-secondary
                outline-none
                transition-colors
                duration-200

                focus:border-soc-accent/50
                focus:ring-2
                focus:ring-soc-accent/10

                sm:text-sm
              "
            >
              <option value="">
                All Statuses
              </option>

              <option value="OPEN">
                Open
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="RESOLVED">
                Resolved
              </option>

              <option value="CLOSED">
                Closed
              </option>
            </select>
          </div>
        </section>

        {/* Loading */}
        {isLoading && (
          <PageLoader message="Loading security incidents..." />
        )}

        {/* Error */}
        {!isLoading && error && (
          <ErrorState
            title="Incidents unavailable"
            message={error}
            onRetry={handleRetry}
            isRetrying={isLoading}
          />
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          incidents.length === 0 && (
            <EmptyState
              icon={ShieldAlert}
              title="No incidents found"
              message={
                search ||
                severity ||
                status
                  ? "No incidents match your current search or filters. Try adjusting the filters."
                  : "No security incidents are currently available."
              }
            />
          )}

        {/* Results */}
        {!isLoading &&
          !error &&
          incidents.length > 0 && (
            <div
              className="
                w-full
                min-w-0
                max-w-full
                space-y-4

                sm:space-y-5
              "
            >
              {/* Tablet / desktop table */}
              <div
                className="
                  hidden
                  w-full
                  min-w-0
                  max-w-full
                  md:block
                "
              >
                <IncidentTable
                  incidents={incidents}
                />
              </div>

              {/* Mobile cards */}
              <div
                className="
                  w-full
                  min-w-0
                  max-w-full
                  space-y-3
                  md:hidden
                "
              >
                {incidents.map(
                  (incident) => (
                    <div
                      key={incident.id}
                      className="
                        w-full
                        min-w-0
                        max-w-full
                      "
                    >
                      <IncidentCard
                        incident={incident}
                      />
                    </div>
                  ),
                )}
              </div>

              {/* Pagination */}
              <div
                className="
                  w-full
                  min-w-0
                  max-w-full
                "
              >
                <IncidentPagination
                  page={page}
                  total={total}
                  hasNext={hasNext}
                  hasPrevious={
                    hasPrevious
                  }
                  onPageChange={
                    setPage
                  }
                />
              </div>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}