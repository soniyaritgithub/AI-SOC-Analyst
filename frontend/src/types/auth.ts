export type UserRole =
  | "ADMIN"
  | "SOC_ANALYST"
  | "MANAGER";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}