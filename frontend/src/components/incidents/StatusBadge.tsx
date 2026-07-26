import type {
  IncidentStatus,
} from "../../types/incident";

interface StatusBadgeProps {
  status: IncidentStatus;
}

const styles: Record<
  IncidentStatus,
  string
> = {
  OPEN: `
    border-soc-accent/20
    bg-soc-accent/10
    text-soc-accent
  `,

  IN_PROGRESS: `
    border-blue-500/20
    bg-blue-500/10
    text-blue-400
  `,

  RESOLVED: `
    border-soc-success/20
    bg-soc-success/10
    text-soc-success
  `,

  CLOSED: `
    border-soc-border
    bg-soc-panel
    text-soc-muted
  `,
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        max-w-full
        items-center
        rounded-lg
        border
        px-2.5
        py-1
        text-xs
        font-semibold
        ${styles[status]}
      `}
    >
      <span className="truncate">
        {status.replaceAll("_", " ")}
      </span>
    </span>
  );
}