from incidents.selectors import IncidentSelector


class DashboardExportService:
    """
    Service for exporting dashboard analytics.
    """

    @staticmethod
    def get_dashboard_data(queryset=None):
        """
        Return all dashboard analytics data.
        """

        if queryset is None:
            queryset = IncidentSelector.get_filtered_queryset({})

        return {
            "statistics": IncidentSelector.get_statistics(queryset),
            "severity_distribution": IncidentSelector.get_severity_distribution(queryset),
            "status_distribution": IncidentSelector.get_status_distribution(queryset),
            "analyst_performance": IncidentSelector.get_analyst_performance(queryset),
            "monthly_trends": IncidentSelector.get_monthly_trends(queryset),
            "recent_incidents": (
                queryset
                .select_related(
                    "assigned_to",
                    "created_by",
                )
                .only(
                    "id",
                    "incident_id",
                    "title",
                    "severity",
                    "status",
                    "created_at",
                    "assigned_to__full_name",
                    "created_by__full_name",
                )
                .order_by("-created_at")
            ),
        }