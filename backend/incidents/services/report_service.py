from incidents.selectors.incident_selector import IncidentSelector


class ReportService:
    """
    Generate SOC reports.
    """

    @staticmethod
    def generate_daily_summary():
        """
        Generate daily incident summary.
        """

        statistics = IncidentSelector.get_statistics()

        severity = (
            IncidentSelector.get_severity_distribution()
        )

        status = (
            IncidentSelector.get_status_distribution()
        )

        return {
            "statistics": statistics,
            "severity": severity,
            "status": status,
        }