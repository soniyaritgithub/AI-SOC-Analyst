import {
  ArrowLeft,
  Home,
  ShieldX,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

export default function ForbiddenPage() {
  const navigate = useNavigate();

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
            border-soc-critical/20
            bg-soc-critical/10

            sm:h-16
            sm:w-16
          "
        >
          <ShieldX
            aria-hidden="true"
            className="
              h-7
              w-7
              text-soc-critical

              sm:h-8
              sm:w-8
            "
          />
        </div>

        <p
          className="
            mt-6
            text-xs
            font-bold
            uppercase
            tracking-[0.2em]
            text-soc-critical
          "
        >
          Error 403
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
          Access Denied
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
          Your account does not have
          permission to access this area of
          the security console.
        </p>

        <div
          className="
            mt-6
            rounded-xl
            border
            border-soc-critical/10
            bg-soc-critical/5
            p-3
          "
        >
          <p
            className="
              break-words
              text-xs
              leading-5
              text-soc-critical
            "
          >
            If you believe you should have
            access, contact a SOC
            administrator.
          </p>
        </div>

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