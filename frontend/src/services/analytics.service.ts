import { API_ENDPOINTS } from "../constants/api";

import type {
  AnalyticsData,
  IncidentStatistics,
  IncidentTrend,
  SeverityDistribution,
  StatusDistribution,
} from "../types/analytics";

import api from "./api";

const analyticsService = {
  async getStatistics(): Promise<IncidentStatistics> {
    const response =
      await api.get<IncidentStatistics>(
        API_ENDPOINTS.INCIDENTS.STATS,
      );

    return response.data;
  },

  async getSeverityDistribution(): Promise<
    SeverityDistribution[]
  > {
    const response =
      await api.get<SeverityDistribution[]>(
        API_ENDPOINTS.INCIDENTS.SEVERITY,
      );

    return Array.isArray(response.data)
      ? response.data
      : [];
  },

  async getStatusDistribution(): Promise<
    StatusDistribution[]
  > {
    const response =
      await api.get<StatusDistribution[]>(
        API_ENDPOINTS.INCIDENTS.STATUS,
      );

    return Array.isArray(response.data)
      ? response.data
      : [];
  },

  async getTrends(): Promise<IncidentTrend[]> {
    const response =
      await api.get<IncidentTrend[]>(
        API_ENDPOINTS.INCIDENTS.TRENDS,
      );

    return Array.isArray(response.data)
      ? response.data
      : [];
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const [
      statistics,
      severity,
      status,
      trends,
    ] = await Promise.all([
      this.getStatistics(),
      this.getSeverityDistribution(),
      this.getStatusDistribution(),
      this.getTrends(),
    ]);

    return {
      statistics,
      severity,
      status,
      trends,
    };
  },
};

export default analyticsService;