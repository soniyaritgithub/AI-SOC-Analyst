import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface IncidentPaginationProps {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  total: number;
  onPageChange: (
    page: number,
  ) => void;
}

export default function IncidentPagination({
  page,
  hasNext,
  hasPrevious,
  total,
  onPageChange,
}: IncidentPaginationProps) {
  if (
    !hasNext &&
    !hasPrevious &&
    page === 1
  ) {
    return null;
  }

  const safePage =
    Number.isFinite(page)
      ? Math.max(1, Math.floor(page))
      : 1;

  const safeTotal =
    Number.isFinite(total)
      ? Math.max(0, Math.floor(total))
      : 0;

  const handlePrevious = () => {
    if (!hasPrevious) {
      return;
    }

    onPageChange(
      Math.max(1, safePage - 1),
    );
  };

  const handleNext = () => {
    if (!hasNext) {
      return;
    }

    onPageChange(safePage + 1);
  };

  return (
    <nav
      aria-label="Incident pagination"
      className="
        flex
        w-full
        min-w-0
        max-w-full
        flex-col
        gap-3
        rounded-2xl
        border border-soc-border
        bg-soc-panel/40
        p-3

        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:gap-4

        lg:p-4
      "
    >
      {/* Total incidents */}
      <p
        className="
          min-w-0
          max-w-full
          break-words
          text-center
          text-xs
          leading-5
          text-soc-muted

          sm:flex-1
          sm:text-left
        "
      >
        {safeTotal.toLocaleString()} total incidents
      </p>

      {/* Pagination controls */}
      <div
        className="
          flex
          w-full
          min-w-0
          max-w-full
          items-center
          justify-center
          gap-2

          sm:w-auto
          sm:shrink-0
        "
      >
        {/* Previous */}
        <button
          type="button"
          disabled={!hasPrevious}
          onClick={handlePrevious}
          aria-label="Go to previous page"
          className="
            inline-flex
            h-9
            min-w-9
            shrink-0
            items-center
            justify-center
            gap-1
            rounded-lg
            border border-soc-border
            px-2
            text-xs
            font-medium
            text-soc-text-secondary
            transition-colors
            duration-200

            hover:bg-soc-panel
            hover:text-soc-text

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-soc-accent/50

            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:bg-transparent

            sm:px-3
          "
        >
          <ChevronLeft
            aria-hidden="true"
            className="
              h-4
              w-4
              shrink-0
            "
          />

          <span className="hidden sm:inline">
            Previous
          </span>
        </button>

        {/* Current page */}
        <div
          aria-current="page"
          aria-label={`Current page ${safePage}`}
          className="
            flex
            h-9
            min-w-10
            max-w-24
            flex-1
            items-center
            justify-center
            overflow-hidden
            rounded-lg
            border border-soc-accent/20
            bg-soc-accent/10
            px-2
            text-xs
            font-semibold
            text-soc-accent

            sm:flex-none
            sm:px-3
          "
        >
          <span
            className="
              min-w-0
              max-w-full
              truncate
            "
            title={`Page ${safePage}`}
          >
            {safePage}
          </span>
        </div>

        {/* Next */}
        <button
          type="button"
          disabled={!hasNext}
          onClick={handleNext}
          aria-label="Go to next page"
          className="
            inline-flex
            h-9
            min-w-9
            shrink-0
            items-center
            justify-center
            gap-1
            rounded-lg
            border border-soc-border
            px-2
            text-xs
            font-medium
            text-soc-text-secondary
            transition-colors
            duration-200

            hover:bg-soc-panel
            hover:text-soc-text

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-soc-accent/50

            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:bg-transparent

            sm:px-3
          "
        >
          <span className="hidden sm:inline">
            Next
          </span>

          <ChevronRight
            aria-hidden="true"
            className="
              h-4
              w-4
              shrink-0
            "
          />
        </button>
      </div>
    </nav>
  );
}