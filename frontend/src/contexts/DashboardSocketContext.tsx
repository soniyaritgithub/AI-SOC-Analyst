import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  dashboardWebSocketService,
} from "../services/dashboard-websocket.service";

import type {
  DashboardIncident,
  DashboardSummary,
  DashboardWebSocketMessage,
} from "../types/dashboard";

import {
  useNotifications,
} from "./NotificationContext";

interface DashboardSocketContextValue {
  liveDashboard: DashboardSummary | null;
  isLive: boolean;
}

const DashboardSocketContext =
  createContext<DashboardSocketContextValue | null>(
    null,
  );

interface DashboardSocketProviderProps {
  children: ReactNode;
}

function safeNumber(
  value: unknown,
): number {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : 0;
}

function safeIncidents(
  value: unknown,
): DashboardIncident[] {
  return Array.isArray(value)
    ? (value as DashboardIncident[])
    : [];
}

function normalizeDashboard(
  data: DashboardSummary,
): DashboardSummary {
  return {
    total_incidents:
      safeNumber(data.total_incidents),

    open_incidents:
      safeNumber(data.open_incidents),

    in_progress_incidents:
      safeNumber(
        data.in_progress_incidents,
      ),

    resolved_incidents:
      safeNumber(
        data.resolved_incidents,
      ),

    closed_incidents:
      safeNumber(data.closed_incidents),

    critical_incidents:
      safeNumber(
        data.critical_incidents,
      ),

    high_incidents:
      safeNumber(data.high_incidents),

    medium_incidents:
      safeNumber(data.medium_incidents),

    low_incidents:
      safeNumber(data.low_incidents),

    active_analysts:
      safeNumber(data.active_analysts),

    recent_incidents:
      safeIncidents(
        data.recent_incidents,
      ),

    latest_alerts:
      safeIncidents(
        data.latest_alerts,
      ),
  };
}

export function DashboardSocketProvider({
  children,
}: DashboardSocketProviderProps) {
  const [
    liveDashboard,
    setLiveDashboard,
  ] =
    useState<DashboardSummary | null>(
      null,
    );

  const [isLive, setIsLive] =
    useState(false);

  const {
    addIncidentNotification,
  } = useNotifications();

  const lastNotificationId =
    useRef<string | null>(null);

  const notificationHandlerRef =
    useRef(
      addIncidentNotification,
    );

  /*
   * Always keep the latest notification
   * function without forcing the WebSocket
   * effect to reconnect whenever its
   * reference changes.
   */
  useEffect(() => {
    notificationHandlerRef.current =
      addIncidentNotification;
  }, [addIncidentNotification]);

  useEffect(() => {
    let isMounted = true;

    const handleMessage = (
      message: DashboardWebSocketMessage,
    ) => {
      if (
        !isMounted ||
        message.type !==
          "dashboard_update"
      ) {
        return;
      }

      const normalized =
        normalizeDashboard(
          message.data,
        );

      setLiveDashboard(normalized);

      const latestIncident =
        normalized.latest_alerts[0];

      if (
        latestIncident &&
        latestIncident.incident_id !==
          lastNotificationId.current
      ) {
        lastNotificationId.current =
          latestIncident.incident_id;

        notificationHandlerRef.current(
          latestIncident,
        );
      }
    };

    const handleConnected = () => {
      if (!isMounted) {
        return;
      }

      setIsLive(true);
    };

    const handleError = () => {
      if (!isMounted) {
        return;
      }

      setIsLive(false);
    };

    dashboardWebSocketService.connect(
      handleMessage,
      handleConnected,
      handleError,
    );

    return () => {
      isMounted = false;

      dashboardWebSocketService.disconnect();
    };
  }, []);

  const value =
    useMemo<DashboardSocketContextValue>(
      () => ({
        liveDashboard,
        isLive,
      }),
      [
        liveDashboard,
        isLive,
      ],
    );

  return (
    <DashboardSocketContext.Provider
      value={value}
    >
      {children}
    </DashboardSocketContext.Provider>
  );
}

export function useDashboardSocket():
  DashboardSocketContextValue {
  const context =
    useContext(
      DashboardSocketContext,
    );

  if (!context) {
    throw new Error(
      "useDashboardSocket must be used inside DashboardSocketProvider.",
    );
  }

  return context;
}