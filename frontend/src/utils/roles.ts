import type {
  User,
  UserRole,
} from "../types/auth";

export function hasRole(
  user: User | null,
  roles: UserRole[],
): boolean {
  if (!user?.role) {
    return false;
  }

  return roles.includes(user.role);
}

export function isAdmin(
  user: User | null,
): boolean {
  return hasRole(user, ["ADMIN"]);
}

export function isManager(
  user: User | null,
): boolean {
  return hasRole(user, ["MANAGER"]);
}

export function isAnalyst(
  user: User | null,
): boolean {
  return hasRole(
    user,
    ["SOC_ANALYST"],
  );
}

export function canManageSOC(
  user: User | null,
): boolean {
  return hasRole(
    user,
    [
      "ADMIN",
      "MANAGER",
    ],
  );
}