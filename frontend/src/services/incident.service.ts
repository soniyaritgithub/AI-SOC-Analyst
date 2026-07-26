import { API_ENDPOINTS } from "../constants/api";

import type {
  AssignmentAnalyst,
  IncidentDetail,
  IncidentFilters,
  IncidentListResponse,
  IncidentStatus,
} from "../types/incident";

import api from "./api";

type IncidentApiResponse =
  | IncidentDetail[]
  | IncidentListResponse;

interface IncidentMutationResponse {
  message: string;
  data: IncidentDetail;
}

const incidentService = {
  async getIncidents(
    filters: IncidentFilters = {},
  ): Promise<IncidentListResponse> {
    const params: Record<string, string | number> = {};

    if (filters.page) {
      params.page = filters.page;
    }

    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.severity) {
      params.severity = filters.severity;
    }

    if (filters.status) {
      params.status = filters.status;
    }

    const response =
      await api.get<IncidentApiResponse>(
        API_ENDPOINTS.INCIDENTS.LIST,
        {
          params,
        },
      );

    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      };
    }

    return {
      count: response.data.count ?? 0,
      next: response.data.next ?? null,
      previous: response.data.previous ?? null,
      results: Array.isArray(response.data.results)
        ? response.data.results
        : [],
    };
  },

  async getIncident(
    id: string,
  ): Promise<IncidentDetail> {
    const response =
      await api.get<IncidentDetail>(
        API_ENDPOINTS.INCIDENTS.DETAIL(id),
      );

    return response.data;
  },

  async changeStatus(
    id: string,
    status: IncidentStatus,
  ): Promise<IncidentDetail> {
    const response =
      await api.patch<IncidentMutationResponse>(
        API_ENDPOINTS.INCIDENTS.CHANGE_STATUS(id),
        {
          status,
        },
      );

    return response.data.data;
  },

  async assignAnalyst(
    id: string,
    analystId: string,
  ): Promise<IncidentDetail> {
    const response =
      await api.patch<IncidentMutationResponse>(
        API_ENDPOINTS.INCIDENTS.ASSIGN(id),
        {
          assigned_to: analystId,
        },
      );

    return response.data.data;
  },

  async getAssignmentAnalysts(): Promise<
    AssignmentAnalyst[]
  > {
    const response =
      await api.get<AssignmentAnalyst[]>(
        API_ENDPOINTS.INCIDENTS
          .ASSIGNMENT_ANALYSTS,
      );

    return Array.isArray(response.data)
      ? response.data
      : [];
  },
};

export default incidentService;