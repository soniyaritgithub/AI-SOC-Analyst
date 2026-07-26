import type {
  UserRole,
} from "../../types/auth";

interface RoleBadgeProps {
  role?: UserRole;
}

const roleLabels: Record<
  UserRole,
  string
> = {
  ADMIN: "Administrator",
  MANAGER: "SOC Manager",
  SOC_ANALYST: "SOC Analyst",
};

export default function RoleBadge({
  role,
}: RoleBadgeProps) {
  if (!role) {
    return null;
  }

  return (
    <span
      className="
        inline-flex
        max-w-full
        items-center
        rounded-full
        border
        border-soc-border
        bg-soc-panel
        px-3
        py-1
        text-xs
        font-semibold
        text-soc-text-secondary
      "
    >
      {roleLabels[role]}
    </span>
  );
}