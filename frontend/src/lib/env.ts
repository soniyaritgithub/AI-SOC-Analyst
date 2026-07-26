const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim();

const wsBaseUrl =
  import.meta.env.VITE_WS_BASE_URL?.trim();

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is missing. Add it to frontend/.env",
  );
}

if (!wsBaseUrl) {
  throw new Error(
    "VITE_WS_BASE_URL is missing. Add it to frontend/.env",
  );
}

function normalizeBaseUrl(
  value: string,
): string {
  return value.replace(/\/+$/, "");
}

export const env = {
  API_BASE_URL:
    normalizeBaseUrl(apiBaseUrl),

  WS_BASE_URL:
    normalizeBaseUrl(wsBaseUrl),
} as const;