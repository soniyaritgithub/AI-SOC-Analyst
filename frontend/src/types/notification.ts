export type NotificationSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface LiveNotification {
  id: string;
  incidentId?: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  createdAt: string;
  isRead: boolean;
}