import type {
  IncidentSeverity,
} from "../../types/incident";

interface SeverityBadgeProps {
  severity: IncidentSeverity;
}

const styles: Record<
  IncidentSeverity,
  string
> = {
  CRITICAL: `
    border-soc-critical/20
    bg-soc-critical/10
    text-soc-critical
  `,

  HIGH: `
    border-orange-500/20
    bg-orange-500/10
    text-orange-400
  `,

  MEDIUM: `
    border-soc-warning/20
    bg-soc-warning/10
    text-soc-warning
  `,

  LOW: `
    border-soc-success/20
    bg-soc-success/10
    text-soc-success
  `,
};

export default function SeverityBadge({
  severity,
}: SeverityBadgeProps) {
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
        ${styles[severity]}
      `}
    >
      <span className="truncate">
        {severity}
      </span>
    </span>
  );
}