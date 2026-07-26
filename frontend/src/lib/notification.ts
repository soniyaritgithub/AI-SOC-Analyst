import type {
  DashboardIncident,
} from "../types/dashboard";

import type {
  LiveNotification,
} from "../types/notification";

export const incidentToNotification = (
  incident: DashboardIncident,
): LiveNotification => {
  return {
    id: `${incident.incident_id}-${incident.created_at}`,
    incidentId: incident.incident_id,
    title: incident.title,
    message: `${incident.severity} security incident detected.`,
    severity: incident.severity,
    createdAt: incident.created_at,
    isRead: false,
  };
};