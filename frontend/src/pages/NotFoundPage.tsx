import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/dashboard", {
      replace: true,
    });
  };

  return (
    <main
      className="
        flex
        min-h-dvh
        w-full
        min-w-0
        items-center
        justify-center
        bg-soc-page
        px-4
        py-8
        text-soc-text

        sm:px-6
        sm:py-10

        lg:px-8
      "
    >
      <section
        className="
          w-full
          min-w-0
          max-w-xl
          rounded-2xl
          border
          border-soc-border
          bg-soc-panel/60
          p-5
          text-center

          sm:p-8
          lg:p-10
        "
      >
        {/* Icon */}
        <div
          className="
            mx-auto
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-soc-accent/20
            bg-soc-accent/10

            sm:h-16
            sm:w-16
          "
        >
          <SearchX
            aria-hidden="true"
            className="
              h-7
              w-7
              text-soc-accent

              sm:h-8
              sm:w-8
            "
          />
        </div>

        {/* Error code */}
        <p
          className="
            mt-6
            text-xs
            font-bold
            uppercase
            tracking-[0.2em]
            text-soc-accent
          "
        >
          Error 404
        </p>

        <h1
          className="
            mt-3
            break-words
            text-2xl
            font-bold
            tracking-tight
            text-soc-text

            sm:text-3xl
          "
        >
          Page Not Found
        </h1>

        <p
          className="
            mx-auto
            mt-3
            max-w-md
            break-words
            text-sm
            leading-6
            text-soc-muted

            sm:text-base
          "
        >
          The page you requested does not
          exist or may have been moved.
        </p>

        {/* Requested path */}
        <div
          className="
            mt-6
            min-w-0
            rounded-xl
            border
            border-soc-border
            bg-soc-page/50
            p-3
          "
        >
          <p
            className="
              text-xs
              font-medium
              text-soc-subtle
            "
          >
            Requested path
          </p>

          <p
            className="
              mt-1
              break-all
              text-sm
              font-medium
              text-soc-text-secondary
            "
          >
            {location.pathname}
          </p>
        </div>

        {/* Actions */}
        <div
          className="
            mt-6
            flex
            min-w-0
            flex-col
            gap-3

            sm:flex-row
            sm:justify-center
          "
        >
          <button
            type="button"
            onClick={handleBack}
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-soc-border
              bg-soc-page
              px-4
              py-2.5
              text-sm
              font-semibold
              text-soc-text-secondary
              transition-colors

              hover:border-soc-subtle/50
              hover:bg-soc-panel
              hover:text-soc-text

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-soc-accent/50

              sm:w-auto
            "
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
            />

            Go Back
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-soc-accent
              px-4
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
              focus-visible:ring-offset-soc-page

              sm:w-auto
            "
          >
            <Home
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
            />

            Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}