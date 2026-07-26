import { env } from "./env";

export const getWebSocketUrl = (
  path: string,
): string => {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${env.WS_BASE_URL}${normalizedPath}`;
};