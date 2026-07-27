from accounts.models import UserRole
from django.contrib.auth import get_user_model
from incidents.models import Incident, IncidentSeverity, IncidentStatus

User = get_user_model()


class DashboardSelector:
    """
    Read-only queries used by the SOC dashboard.
    """

    @staticmethod
    def get_statistics():
        """
        Return dashboard statistics, chart data,
        recent incidents, alerts, and analyst counts.
        """

        # ---------------------------------------------------------
        # Incident summary
        # ---------------------------------------------------------

        total_incidents = Incident.objects.count()

        open_incidents = Incident.objects.filter(
            status=IncidentStatus.OPEN
        ).count()

        in_progress_incidents = Incident.objects.filter(
            status=IncidentStatus.IN_PROGRESS
        ).count()

        resolved_incidents = Incident.objects.filter(
            status=IncidentStatus.RESOLVED
        ).count()

        closed_incidents = Incident.objects.filter(
            status=IncidentStatus.CLOSED
        ).count()

        # ---------------------------------------------------------
        # Severity statistics
        # ---------------------------------------------------------

        critical_incidents = Incident.objects.filter(
            severity=IncidentSeverity.CRITICAL
        ).count()

        high_incidents = Incident.objects.filter(
            severity=IncidentSeverity.HIGH
        ).count()

        medium_incidents = Incident.objects.filter(
            severity=IncidentSeverity.MEDIUM
        ).count()

        low_incidents = Incident.objects.filter(
            severity=IncidentSeverity.LOW
        ).count()

        # ---------------------------------------------------------
        # Recent incidents
        # ---------------------------------------------------------

        recent_incidents = (
            Incident.objects.only(
                "incident_id",
                "title",
                "severity",
                "status",
                "created_at",
            )
            .order_by("-created_at")[:5]
        )

        # ---------------------------------------------------------
        # Latest alerts
        # ---------------------------------------------------------

        latest_alerts = (
            Incident.objects.only(
                "incident_id",
                "title",
                "severity",
                "status",
                "created_at",
            )
            .order_by("-created_at")[:5]
        )

        # ---------------------------------------------------------
        # Analysts
        # ---------------------------------------------------------

        active_analysts = User.objects.filter(
            is_active=True,
            role="SOC_ANALYST",
        ).count()

        # ---------------------------------------------------------
        # Final dashboard payload
        # ---------------------------------------------------------

        return {
            "total_incidents": total_incidents,

            "open_incidents": open_incidents,
            "in_progress_incidents": in_progress_incidents,
            "resolved_incidents": resolved_incidents,
            "closed_incidents": closed_incidents,

            "critical_incidents": critical_incidents,
            "high_incidents": high_incidents,
            "medium_incidents": medium_incidents,
            "low_incidents": low_incidents,

            "severity_chart": {
                "critical": critical_incidents,
                "high": high_incidents,
                "medium": medium_incidents,
                "low": low_incidents,
            },

            "status_chart": {
                "open": open_incidents,
                "in_progress": in_progress_incidents,
                "resolved": resolved_incidents,
                "closed": closed_incidents,
            },

            "recent_incidents": recent_incidents,
            "latest_alerts": latest_alerts,

            "active_analysts": active_analysts,
        }