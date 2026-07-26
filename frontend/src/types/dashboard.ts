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

export interface DashboardIncident {
  incident_id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  created_at: string;
}

export interface DashboardSummary {
  total_incidents: number;
  open_incidents: number;
  in_progress_incidents: number;
  resolved_incidents: number;
  closed_incidents: number;

  critical_incidents: number;
  high_incidents: number;
  medium_incidents: number;
  low_incidents: number;

  active_analysts: number;

  recent_incidents: DashboardIncident[];
  latest_alerts: DashboardIncident[];
}

export interface DashboardWebSocketUpdate {
  type: "dashboard_update";
  data: DashboardSummary;
}

export interface DashboardWebSocketConnection {
  type: "connection";
  message: string;
}

export type DashboardWebSocketMessage =
  | DashboardWebSocketUpdate
  | DashboardWebSocketConnection;