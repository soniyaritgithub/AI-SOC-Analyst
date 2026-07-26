import {
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

export default function RouteLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
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

        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          flex
          w-full
          min-w-0
          max-w-sm
          flex-col
          items-center
          text-center
        "
      >
        {/* SOC icon */}
        <div
          className="
            relative
            flex
            h-16
            w-16
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-soc-accent/20
            bg-soc-accent/10

            sm:h-18
            sm:w-18
          "
        >
          <ShieldCheck
            aria-hidden="true"
            className="
              h-7
              w-7
              text-soc-accent

              sm:h-8
              sm:w-8
            "
          />

          <span
            aria-hidden="true"
            className="
              absolute
              -bottom-1
              -right-1
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              border
              border-soc-border
              bg-soc-page
            "
          >
            <LoaderCircle
              className="
                h-4
                w-4
                animate-spin
                text-soc-accent
              "
            />
          </span>
        </div>

        {/* Text */}
        <div className="mt-5 min-w-0">
          <p
            className="
              break-words
              text-sm
              font-semibold
              text-soc-text
            "
          >
            Loading Security Console
          </p>

          <p
            className="
              mt-2
              break-words
              text-xs
              leading-5
              text-soc-muted

              sm:text-sm
            "
          >
            Preparing the requested SOC
            workspace...
          </p>
        </div>

        {/* Loading indicator */}
        <div
          aria-hidden="true"
          className="
            mt-5
            h-1
            w-full
            max-w-48
            overflow-hidden
            rounded-full
            bg-soc-border
          "
        >
          <div
            className="
              h-full
              w-1/2
              animate-pulse
              rounded-full
              bg-soc-accent
            "
          />
        </div>

        <span className="sr-only">
          Loading requested page...
        </span>
      </div>
    </div>
  );
}