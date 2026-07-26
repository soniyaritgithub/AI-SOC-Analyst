import { env } from "../lib/env";

import type {
  DashboardWebSocketMessage,
} from "../types/dashboard";

type MessageHandler = (
  message: DashboardWebSocketMessage,
) => void;

type ConnectionHandler = () => void;

type ErrorHandler = (
  event: Event,
) => void;

class DashboardWebSocketService {
  private socket: WebSocket | null = null;

  private reconnectTimer:
    | ReturnType<typeof setTimeout>
    | null = null;

  private disconnectTimer:
    | ReturnType<typeof setTimeout>
    | null = null;

  private shouldReconnect = false;

  private reconnectAttempts = 0;

  private readonly maxReconnectAttempts = 5;

  private onMessage:
    | MessageHandler
    | null = null;

  private onConnected:
    | ConnectionHandler
    | undefined;

  private onError:
    | ErrorHandler
    | undefined;

  connect(
    onMessage: MessageHandler,
    onConnected?: ConnectionHandler,
    onError?: ErrorHandler,
  ): void {
    this.onMessage = onMessage;
    this.onConnected = onConnected;
    this.onError = onError;

    /*
     * React StrictMode may immediately
     * unmount and remount the provider in
     * development. Cancel a pending delayed
     * disconnect when connect() runs again.
     */
    if (this.disconnectTimer) {
      clearTimeout(
        this.disconnectTimer,
      );

      this.disconnectTimer = null;
    }

    this.shouldReconnect = true;

    /*
     * Do not create another socket while
     * the current one is open or connecting.
     */
    if (
      this.socket &&
      (
        this.socket.readyState ===
          WebSocket.OPEN ||
        this.socket.readyState ===
          WebSocket.CONNECTING
      )
    ) {
      if (
        this.socket.readyState ===
        WebSocket.OPEN
      ) {
        this.onConnected?.();
      }

      return;
    }

    /*
     * Avoid creating another connection
     * while a reconnect timer is pending.
     */
    if (this.reconnectTimer) {
      return;
    }

    this.createSocket();
  }

  private createSocket(): void {
    if (!this.shouldReconnect) {
      return;
    }

    if (
      this.socket &&
      (
        this.socket.readyState ===
          WebSocket.OPEN ||
        this.socket.readyState ===
          WebSocket.CONNECTING
      )
    ) {
      return;
    }

    const socketUrl =
      `${env.WS_BASE_URL}/ws/dashboard/`;

    const socket =
      new WebSocket(socketUrl);

    this.socket = socket;

    socket.onopen = () => {
      /*
       * Ignore events from an older socket.
       */
      if (this.socket !== socket) {
        return;
      }

      this.reconnectAttempts = 0;

      console.info(
        "Dashboard WebSocket connected.",
      );

      this.onConnected?.();
    };

    socket.onmessage = (event) => {
      if (this.socket !== socket) {
        return;
      }

      try {
        const message =
          JSON.parse(
            event.data,
          ) as DashboardWebSocketMessage;

        this.onMessage?.(message);
      } catch (error) {
        console.error(
          "Invalid dashboard WebSocket message:",
          error,
        );
      }
    };

    socket.onerror = (event) => {
      if (this.socket !== socket) {
        return;
      }

      console.error(
        "Dashboard WebSocket error:",
        event,
      );

      this.onError?.(event);
    };

    socket.onclose = () => {
      /*
       * An older socket may close after a
       * newer connection has been created.
       */
      if (this.socket !== socket) {
        return;
      }

      this.socket = null;

      if (!this.shouldReconnect) {
        return;
      }

      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (
      !this.shouldReconnect ||
      this.reconnectTimer
    ) {
      return;
    }

    if (
      this.reconnectAttempts >=
      this.maxReconnectAttempts
    ) {
      console.warn(
        "Dashboard WebSocket reconnect limit reached.",
      );

      return;
    }

    this.reconnectAttempts += 1;

    const delay = Math.min(
      1000 *
        2 **
          (this.reconnectAttempts - 1),
      10000,
    );

    this.reconnectTimer =
      setTimeout(() => {
        this.reconnectTimer = null;

        if (!this.shouldReconnect) {
          return;
        }

        this.createSocket();
      }, delay);
  }

  disconnect(): void {
    /*
     * Delay the real disconnect by one event
     * loop cycle for React StrictMode's
     * development cleanup/setup cycle.
     */
    if (this.disconnectTimer) {
      clearTimeout(
        this.disconnectTimer,
      );
    }

    this.disconnectTimer =
      setTimeout(() => {
        this.disconnectTimer = null;

        this.performDisconnect();
      }, 0);
  }

  private performDisconnect(): void {
    this.shouldReconnect = false;
    this.reconnectAttempts = 0;

    if (this.reconnectTimer) {
      clearTimeout(
        this.reconnectTimer,
      );

      this.reconnectTimer = null;
    }

    const socket = this.socket;

    this.socket = null;

    /*
     * Remove handlers before intentional
     * close so it cannot start reconnecting.
     */
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (
        socket.readyState ===
          WebSocket.OPEN ||
        socket.readyState ===
          WebSocket.CONNECTING
      ) {
        socket.close(
          1000,
          "Dashboard socket disconnected",
        );
      }
    }

    this.onMessage = null;
    this.onConnected = undefined;
    this.onError = undefined;
  }

  isConnected(): boolean {
    return (
      this.socket?.readyState ===
      WebSocket.OPEN
    );
  }
}

export const dashboardWebSocketService =
  new DashboardWebSocketService();