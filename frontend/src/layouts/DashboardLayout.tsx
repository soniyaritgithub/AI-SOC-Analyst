import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  /*
   * Mobile sidebar behavior:
   * - Escape closes the sidebar
   * - Body scrolling is disabled while open
   * - Sidebar closes automatically on desktop
   */
  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    const mediaQuery =
      window.matchMedia(
        "(min-width: 1024px)",
      );

    const lockBodyScroll = () => {
      if (!mediaQuery.matches) {
        document.body.style.overflow =
          "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    const handleBreakpointChange = () => {
      lockBodyScroll();

      if (mediaQuery.matches) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    mediaQuery.addEventListener(
      "change",
      handleBreakpointChange,
    );

    lockBodyScroll();

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      mediaQuery.removeEventListener(
        "change",
        handleBreakpointChange,
      );

      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className="
        min-h-screen
        min-h-dvh
        w-full
        min-w-0
        bg-soc-page
        text-soc-text
      "
    >
      <div
        className="
          flex
          min-h-screen
          min-h-dvh
          w-full
          min-w-0
        "
      >
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
        />

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            bg-soc-page
          "
        >
          <DashboardHeader
            onMenuClick={handleOpenSidebar}
          />

          <main
            className="
              min-h-[calc(100dvh-4rem)]
              w-full
              min-w-0
              flex-1

              lg:min-h-[calc(100dvh-5rem)]
            "
          >
            <div
              className="
                mx-auto
                w-full
                min-w-0
                max-w-[1600px]

                px-4
                py-4

                sm:px-5
                sm:py-5

                lg:px-6
                lg:py-6

                xl:px-8
                xl:py-8
              "
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}