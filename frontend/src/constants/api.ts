export const API_ENDPOINTS = {
  AUTH: {
  REGISTER: "/api/accounts/register/",
  LOGIN: "/api/accounts/login/",
  LOGOUT: "/api/accounts/logout/",
  REFRESH: "/api/accounts/refresh/",
  ME: "/api/accounts/me/",
},
  DASHBOARD: {
    ROOT: "/api/dashboard/",
  },

  INCIDENTS: {
    LIST: "/api/incidents/",

    DETAIL: (id: string) =>
      `/api/incidents/${id}/`,

    CREATE: "/api/incidents/create/",

    UPDATE: (id: string) =>
      `/api/incidents/${id}/update/`,

    DELETE: (id: string) =>
      `/api/incidents/${id}/delete/`,

    ASSIGN: (id: string) =>
      `/api/incidents/${id}/assign/`,

    CHANGE_STATUS: (id: string) =>
      `/api/incidents/${id}/status/`,

    ANALYSTS: "/api/incidents/analysts/",

    ASSIGNMENT_ANALYSTS:
  "/api/incidents/assignment-analysts/",

    STATS: "/api/incidents/stats/",
    SEVERITY: "/api/incidents/severity/",
    STATUS: "/api/incidents/status/",
    TRENDS: "/api/incidents/trends/",
  },
} as const;