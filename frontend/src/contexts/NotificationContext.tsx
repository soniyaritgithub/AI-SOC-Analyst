import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  DashboardIncident,
} from "../types/dashboard";

import type {
  LiveNotification,
} from "../types/notification";

import {
  incidentToNotification,
} from "../lib/notification";

interface NotificationContextValue {
  notifications: LiveNotification[];
  unreadCount: number;

  addIncidentNotification: (
    incident: DashboardIncident,
  ) => void;

  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext =
  createContext<NotificationContextValue | null>(
    null,
  );

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [notifications, setNotifications] =
    useState<LiveNotification[]>([]);

  const addIncidentNotification =
    useCallback(
      (incident: DashboardIncident) => {
        const notification =
          incidentToNotification(incident);

        setNotifications((current) => {
          const alreadyExists =
            current.some(
              (item) =>
                item.id === notification.id,
            );

          if (alreadyExists) {
            return current;
          }

          return [
            notification,
            ...current,
          ].slice(0, 50);
        });
      },
      [],
    );

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    },
    [],
  );

  const markAllAsRead =
    useCallback(() => {
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    }, []);

  const clearNotifications =
    useCallback(() => {
      setNotifications([]);
    }, []);

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          !notification.isRead,
      ).length,
    [notifications],
  );

  const value =
    useMemo<NotificationContextValue>(
      () => ({
        notifications,
        unreadCount,
        addIncidentNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }),
      [
        notifications,
        unreadCount,
        addIncidentNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      ],
    );

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider.",
    );
  }

  return context;
}