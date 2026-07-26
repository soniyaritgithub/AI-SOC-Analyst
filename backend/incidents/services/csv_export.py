import csv
import io

from incidents.services.dashboard_export import DashboardExportService


class CSVExportService:
    """
    Service for exporting dashboard data as CSV.
    """

    @staticmethod
    def export_dashboard(queryset=None):
        """
        Generate CSV data from dashboard analytics.
        """

        dashboard_data = DashboardExportService.get_dashboard_data(
            queryset=queryset,
        )

        output = io.StringIO()
        writer = csv.writer(output)

        # Title
        writer.writerow(["SOC Incident Dashboard Report"])
        writer.writerow([])

        # Statistics
        writer.writerow(["Statistics"])
        writer.writerow(["Metric", "Value"])

        statistics = dashboard_data["statistics"]

        writer.writerow(
            ["Total Incidents", statistics["total_incidents"]]
        )
        writer.writerow(
            ["Open", statistics["open"]]
        )
        writer.writerow(
            ["In Progress", statistics["in_progress"]]
        )
        writer.writerow(
            ["Resolved", statistics["resolved"]]
        )
        writer.writerow(
            ["Closed", statistics["closed"]]
        )

        writer.writerow([])

        # Severity Distribution
        writer.writerow(["Severity Distribution"])
        writer.writerow(["Severity", "Count"])

        for item in dashboard_data["severity_distribution"]:
            writer.writerow(
                [
                    item["severity"],
                    item["count"],
                ]
            )

        writer.writerow([])

        # Status Distribution
        writer.writerow(["Status Distribution"])
        writer.writerow(["Status", "Count"])

        for item in dashboard_data["status_distribution"]:
            writer.writerow(
                [
                    item["status"],
                    item["count"],
                ]
            )

        writer.writerow([])

        # Analyst Performance
        writer.writerow(["Analyst Performance"])
        writer.writerow(["Analyst", "Total Incidents"])

        for item in dashboard_data["analyst_performance"]:
            writer.writerow(
                [
                    item["analyst"],
                    item["total_incidents"],
                ]
            )

        writer.writerow([])

        # Monthly Trends
        writer.writerow(["Monthly Trends"])
        writer.writerow(["Month", "Count"])

        for item in dashboard_data["monthly_trends"]:
            writer.writerow(
                [
                    item["month"],
                    item["count"],
                ]
            )

        writer.writerow([])

        # Recent Incidents
        writer.writerow(["Recent Incidents"])
        writer.writerow(
            [
                "Incident ID",
                "Title",
                "Severity",
                "Status",
                "Assigned To",
                "Created By",
                "Created At",
            ]
        )

        for incident in dashboard_data["recent_incidents"]:
            writer.writerow(
                [
                    incident.incident_id,
                    incident.title,
                    incident.severity,
                    incident.status,
                    incident.assigned_to.full_name,
                    incident.created_by.full_name,
                    incident.created_at,
                ]
            )

        return output.getvalue()