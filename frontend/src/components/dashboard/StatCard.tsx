import type {
  LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value?: number | null;
  description: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  const safeValue =
    typeof value === "number" &&
    Number.isFinite(value)
      ? value
      : 0;

  return (
    <article
      className="
        flex
        h-full
        w-full
        min-w-0
        max-w-full
        flex-col
        rounded-2xl
        border border-soc-border
        bg-soc-panel/60
        p-4
        transition-colors
        duration-200

        hover:border-soc-subtle/50
        hover:bg-soc-panel

        sm:p-5
        lg:p-6
      "
    >
      <div
        className="
          flex
          min-w-0
          items-start
          justify-between
          gap-3

          sm:gap-4
        "
      >
        <div className="min-w-0 flex-1">
          <p
            className="
              break-words
              text-sm
              font-medium
              text-soc-muted
            "
          >
            {title}
          </p>

          <p
            className="
              mt-3
              max-w-full
              break-words
              text-2xl
              font-bold
              tracking-tight
              text-soc-text

              sm:text-3xl
            "
          >
            {safeValue.toLocaleString()}
          </p>
        </div>

        <div
          className="
            flex
            h-10 w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border border-soc-accent/20
            bg-soc-accent/10

            sm:h-11
            sm:w-11
          "
        >
          <Icon
            aria-hidden="true"
            className="
              h-5 w-5
              shrink-0
              text-soc-accent
            "
          />
        </div>
      </div>

      <p
        className="
          mt-4
          max-w-full
          break-words
          text-xs
          leading-5
          text-soc-muted

          sm:text-sm
        "
      >
        {description}
      </p>
    </article>
  );
}