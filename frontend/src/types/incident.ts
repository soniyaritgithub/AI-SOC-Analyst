export type IncidentSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type IncidentStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface Incident {
  id: string;
  incident_id: string;
  title: string;
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;

  assigned_to?: string | null;

  created_at: string;
  updated_at?: string;
}

export interface IncidentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Incident[];
}

export interface IncidentFilters {
  page?: number;
  search?: string;
  severity?: IncidentSeverity | "";
  status?: IncidentStatus | "";
}

export interface IncidentDetail {
  id: string;
  incident_id: string;
  title: string;
  description: string;

  severity: IncidentSeverity;
  status: IncidentStatus;

  assigned_to: string | null;
  created_by: string | null;

  created_at: string;
  updated_at: string;
}
export interface IncidentActionResponse {
  message: string;
  data: IncidentDetail;
}

export interface AssignIncidentPayload {
  assigned_to: string;
}

export interface ChangeIncidentStatusPayload {
  status: IncidentStatus;
}

export interface AssignmentAnalyst {
  id: string;
  full_name: string;
  email: string;
}