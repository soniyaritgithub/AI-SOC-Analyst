import {
  Bell,
  CheckCheck,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useNotifications,
} from "../../contexts/NotificationContext";

const severityClasses = {
  LOW: "bg-emerald-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-orange-400",
  CRITICAL: "bg-red-400",
} as const;

export default function NotificationBell() {
  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        aria-label="Notifications"
        onClick={() =>
          setIsOpen((current) => !current)
        }
        className="
          relative flex h-10 w-10
          items-center justify-center
          rounded-xl
          border border-slate-800
          bg-slate-900
          text-slate-400
          transition
          hover:border-slate-700
          hover:text-white
        "
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span
            className="
              absolute -right-1 -top-1
              flex min-h-5 min-w-5
              items-center justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px] font-bold
              text-white
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="
            fixed inset-x-3 top-16 z-[70]
            max-h-[calc(100vh-5rem)]
            overflow-hidden
            rounded-2xl
            border border-slate-800
            bg-slate-950
            shadow-2xl

            sm:absolute
            sm:inset-x-auto
            sm:right-0
            sm:top-12
            sm:w-[380px]

            lg:w-[420px]
          "
        >
          <div
            className="
              flex items-center
              justify-between
              border-b border-slate-800
              px-4 py-4
            "
          >
            <div>
              <h3
                className="
                  text-sm font-semibold
                  text-white
                "
              >
                Live Notifications
              </h3>

              <p
                className="
                  mt-1 text-xs
                  text-slate-500
                "
              >
                {unreadCount} unread
              </p>
            </div>

            <button
              type="button"
              aria-label="Close notifications"
              onClick={() =>
                setIsOpen(false)
              }
              className="
                rounded-lg p-2
                text-slate-500
                hover:bg-slate-900
                hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {notifications.length > 0 && (
            <div
              className="
                flex items-center
                justify-between gap-3
                border-b border-slate-800
                px-4 py-3
              "
            >
              <button
                type="button"
                onClick={markAllAsRead}
                className="
                  flex items-center gap-2
                  text-xs font-medium
                  text-cyan-400
                  hover:text-cyan-300
                "
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>

              <button
                type="button"
                onClick={clearNotifications}
                className="
                  flex items-center gap-2
                  text-xs font-medium
                  text-slate-500
                  hover:text-red-400
                "
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
          )}

          <div
            className="
              max-h-[60vh]
              overflow-y-auto
            "
          >
            {notifications.length === 0 ? (
              <div
                className="
                  px-6 py-12
                  text-center
                "
              >
                <Bell
                  className="
                    mx-auto h-8 w-8
                    text-slate-700
                  "
                />

                <p
                  className="
                    mt-3 text-sm
                    text-slate-400
                  "
                >
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => {
                      markAsRead(
                        notification.id,
                      );

                      setIsOpen(false);

                      navigate("/incidents");
                    }}
                    className={`
                      flex w-full gap-3
                      border-b border-slate-900
                      px-4 py-4
                      text-left
                      transition
                      hover:bg-slate-900/70

                      ${
                        notification.isRead
                          ? "bg-transparent"
                          : "bg-cyan-500/[0.03]"
                      }
                    `}
                  >
                    <span
                      className={`
                        mt-2 h-2.5 w-2.5
                        shrink-0 rounded-full
                        ${
                          severityClasses[
                            notification.severity
                          ]
                        }
                      `}
                    />

                    <span className="min-w-0 flex-1">
                      <span
                        className="
                          block truncate
                          text-sm font-semibold
                          text-slate-200
                        "
                      >
                        {notification.title}
                      </span>

                      <span
                        className="
                          mt-1 block
                          text-xs leading-5
                          text-slate-500
                        "
                      >
                        {notification.message}
                      </span>

                      <span
                        className="
                          mt-2 block
                          text-[11px]
                          text-slate-600
                        "
                      >
                        {new Date(
                          notification.createdAt,
                        ).toLocaleString()}
                      </span>
                    </span>
                  </button>
                ),
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}