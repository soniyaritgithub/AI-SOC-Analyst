import {
  Menu,
  Search,
  ShieldCheck,
} from "lucide-react";

import NotificationBell from "../notifications/NotificationBell";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16
        w-full min-w-0
        items-center
        gap-2
        border-b border-soc-border
        bg-soc-page/90
        px-3
        backdrop-blur-xl

        sm:gap-3
        sm:px-5

        lg:h-20
        lg:px-6

        xl:px-8
      "
    >
      {/* Mobile / tablet navigation button */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="
          flex h-10 w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border border-soc-border
          text-soc-text-secondary
          transition-colors

          hover:bg-soc-panel
          hover:text-soc-text

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-soc-accent/50

          lg:hidden
        "
      >
        <Menu
          className="h-5 w-5"
          aria-hidden="true"
        />
      </button>

      {/* Header identity */}
      <div
        className="
          min-w-0
          flex-1

          md:flex-none
        "
      >
        <div
          className="
            flex min-w-0
            items-center gap-2
          "
        >
          <ShieldCheck
            className="
              hidden h-5 w-5
              shrink-0
              text-soc-accent

              sm:block
            "
            aria-hidden="true"
          />

          <h1
            className="
              min-w-0
              truncate
              text-sm font-bold
              text-soc-text

              min-[360px]:text-base

              sm:text-lg
            "
          >
            SOC Dashboard
          </h1>
        </div>

        <p
          className="
            hidden
            truncate
            text-xs
            text-soc-muted

            sm:block
          "
        >
          Real-time security monitoring
        </p>
      </div>

      {/* Flexible spacing */}
      <div
        className="
          hidden
          min-w-0
          flex-1

          md:block
        "
        aria-hidden="true"
      />

      {/* Desktop / tablet search */}
      <div
        className="
          relative
          hidden
          min-w-0
          w-full
          max-w-[14rem]
          shrink

          md:block

          lg:max-w-xs

          xl:max-w-sm
        "
      >
        <Search
          className="
            pointer-events-none
            absolute
            left-3 top-1/2
            h-4 w-4
            -translate-y-1/2
            text-soc-subtle
          "
          aria-hidden="true"
        />

        <input
          type="search"
          placeholder="Search incidents..."
          aria-label="Search incidents"
          className="
            h-10
            w-full min-w-0
            rounded-xl
            border border-soc-border
            bg-soc-panel
            pl-10 pr-3
            text-sm
            text-soc-text-secondary
            outline-none
            transition

            placeholder:text-soc-subtle

            focus:border-soc-accent/50
            focus:ring-2
            focus:ring-soc-accent/10
          "
        />
      </div>

      {/* Right-side actions */}
      <div
        className="
          flex
          shrink-0
          items-center
          gap-1

          min-[360px]:gap-2

          sm:gap-3
        "
      >
        <NotificationBell />

        {/* User identity */}
        <div
          className="
            flex
            min-w-0
            shrink-0
            items-center
            gap-3
          "
        >
          <div
            className="
              flex h-9 w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border border-soc-accent/20
              bg-soc-accent/10
              text-xs font-bold
              text-soc-accent

              sm:h-10
              sm:w-10
              sm:text-sm
            "
            aria-label="SOC user"
          >
            SOC
          </div>

          <div
            className="
              hidden
              min-w-0
              max-w-44

              xl:block
            "
          >
            <p
              className="
                truncate
                text-sm font-semibold
                text-soc-text-secondary
              "
            >
              SOC Analyst
            </p>

            <p
              className="
                truncate
                text-xs
                text-soc-muted
              "
            >
              Security Operations
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}