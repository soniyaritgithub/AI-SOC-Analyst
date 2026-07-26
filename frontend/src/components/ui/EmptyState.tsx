import {
  Inbox,
  type LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: LucideIcon;
}

export default function EmptyState({
  title = "Nothing to display",
  message,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div
      className="
        flex min-h-64
        w-full
        items-center justify-center
        rounded-2xl
        border border-slate-800
        bg-slate-900/40
        p-5 text-center

        sm:p-6
      "
    >
      <div
        className="
          w-full max-w-md
        "
      >
        <div
          className="
            mx-auto
            flex h-12 w-12
            items-center justify-center
            rounded-xl
            border border-slate-800
            bg-slate-900
          "
        >
          <Icon
            className="
              h-6 w-6
              text-slate-600
            "
            aria-hidden="true"
          />
        </div>

        <h3
          className="
            mt-4
            text-sm font-semibold
            text-slate-300

            sm:text-base
          "
        >
          {title}
        </h3>

        <p
          className="
            mx-auto mt-2
            max-w-sm
            break-words
            text-sm leading-6
            text-slate-500
          "
        >
          {message}
        </p>
      </div>
    </div>
  );
}