from dashboard.selectors.dashboard_selector import DashboardSelector
from notifications.services.websocket_service import WebSocketService


class DashboardService:
    """
    Service responsible for preparing and broadcasting dashboard data.
    """

    @staticmethod
    def get_dashboard_data():
        """
        Get dashboard statistics and convert QuerySets
        into JSON-serializable data.
        """

        statistics = DashboardSelector.get_statistics()

        recent_incidents = statistics.get(
            "recent_incidents",
            [],
        )

        latest_alerts = statistics.get(
            "latest_alerts",
            [],
        )

        statistics["recent_incidents"] = [
            {
                "incident_id": incident.incident_id,
                "title": incident.title,
                "severity": incident.severity,
                "status": incident.status,
                "created_at": incident.created_at.isoformat(),
            }
            for incident in recent_incidents
        ]

        statistics["latest_alerts"] = [
            {
                "incident_id": incident.incident_id,
                "title": incident.title,
                "severity": incident.severity,
                "status": incident.status,
                "created_at": incident.created_at.isoformat(),
            }
            for incident in latest_alerts
        ]

        return statistics

    @classmethod
    def get_dashboard(cls):
        """
        Backward-compatible dashboard accessor.
        """

        return cls.get_dashboard_data()

    @classmethod
    def broadcast_dashboard(cls):
        """
        Broadcast the latest dashboard data through WebSocket.
        """

        data = cls.get_dashboard_data()

        WebSocketService.send_dashboard_update(
            data,
        )

        return data