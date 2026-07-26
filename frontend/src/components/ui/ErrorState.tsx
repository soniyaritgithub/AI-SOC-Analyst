import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="
        w-full
        rounded-2xl
        border border-red-500/20
        bg-red-500/5
        p-5

        sm:p-6
      "
    >
      <div
        className="
          flex flex-col gap-4

          sm:flex-row
          sm:items-start
        "
      >
        <div
          className="
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-xl
            bg-red-500/10
          "
        >
          <AlertTriangle
            className="
              h-5 w-5
              text-red-300
            "
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="
              text-sm font-semibold
              text-red-200

              sm:text-base
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              break-words
              text-sm leading-6
              text-slate-400
            "
          >
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className="
                mt-4
                inline-flex w-full
                items-center justify-center
                gap-2
                rounded-xl
                border border-red-500/20
                bg-red-500/10
                px-4 py-2.5
                text-sm font-semibold
                text-red-300
                transition

                hover:bg-red-500/20

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-red-400

                disabled:cursor-not-allowed
                disabled:opacity-60

                sm:w-auto
              "
            >
              <RefreshCw
                className={`
                  h-4 w-4
                  ${
                    isRetrying
                      ? "animate-spin"
                      : ""
                  }
                `}
                aria-hidden="true"
              />

              {isRetrying
                ? "Retrying..."
                : "Try again"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}