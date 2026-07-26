export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "SOC_ANALYST";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  full_name: string;
  department: string;
  phone_number: string;
  password: string;
  confirm_password: string;
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

  /*
   * Every authenticated user in the backend
   * always has a role because User.role has
   * a database default.
   */
  role: UserRole;

  department?: string;
  phone_number?: string;
  is_active?: boolean;
  is_staff?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}