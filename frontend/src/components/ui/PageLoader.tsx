import {
  LoaderCircle,
} from "lucide-react";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function PageLoader({
  message = "Loading...",
  fullScreen = false,
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        flex w-full
        items-center justify-center
        p-6

        ${
          fullScreen
            ? "min-h-screen bg-slate-950"
            : `
              min-h-64
              rounded-2xl
              border border-slate-800
              bg-slate-900/40
            `
        }
      `}
    >
      <div
        className="
          flex max-w-sm
          flex-col items-center
          text-center
        "
      >
        <LoaderCircle
          className="
            h-7 w-7
            animate-spin
            text-cyan-400
          "
          aria-hidden="true"
        />

        <p
          className="
            mt-3
            text-sm leading-6
            text-slate-400
          "
        >
          {message}
        </p>
      </div>
    </div>
  );
}