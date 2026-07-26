import api from "./api";

import type {
  DashboardSummary,
} from "../types/dashboard";

const DASHBOARD_ENDPOINT =
  "/api/incidents/dashboard/";

export const dashboardService = {
  async getDashboard(): Promise<DashboardSummary> {
    const response =
      await api.get<DashboardSummary>(
        DASHBOARD_ENDPOINT,
      );

    return response.data;
  },
};

export default dashboardService;