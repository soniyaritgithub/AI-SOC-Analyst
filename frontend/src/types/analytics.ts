export interface IncidentStatistics {
  total_incidents: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
}

export interface SeverityDistribution {
  severity: string;
  count: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface IncidentTrend {
  month: string;
  count: number;
}

export interface AnalyticsData {
  statistics: IncidentStatistics;
  severity: SeverityDistribution[];
  status: StatusDistribution[];
  trends: IncidentTrend[];
}