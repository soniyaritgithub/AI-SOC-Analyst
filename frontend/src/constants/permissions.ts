import type {
  UserRole,
} from "../types/auth";

export const ALL_USER_ROLES: UserRole[] = [
  "ADMIN",
  "MANAGER",
  "SOC_ANALYST",
];

export const MANAGEMENT_ROLES: UserRole[] = [
  "ADMIN",
  "MANAGER",
];

export const ADMIN_ONLY_ROLES: UserRole[] = [
  "ADMIN",
];

export function hasRequiredRole(
  userRole: UserRole | undefined,
  allowedRoles: readonly UserRole[],
): boolean {
  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
}