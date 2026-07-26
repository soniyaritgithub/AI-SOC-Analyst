from audit_logs.models import AuditAction
from audit_logs.services import AuditLogService
from dashboard.services.dashboard_service import DashboardService
from incidents.models import IncidentStatus
from incidents.utils.cache import clear_dashboard_cache


class IncidentService:
    """
    Service layer for Incident business logic.

    Handles incident operations and triggers real-time
    dashboard updates after incident data changes.
    """

    @staticmethod
    def _refresh_dashboard():
        """
        Clear cached dashboard data and broadcast
        fresh statistics to connected dashboard clients.
        """
        clear_dashboard_cache()
        DashboardService.broadcast_dashboard()

    @staticmethod
    def delete_incident(incident):
        """
        Delete an incident.
        """

        AuditLogService.create_log(
            user=incident.created_by,
            incident=incident,
            action=AuditAction.DELETED,
            description=f"Deleted incident {incident.incident_id}.",
        )

        incident.delete()

        IncidentService._refresh_dashboard()

    @staticmethod
    def create_incident(serializer):
        """
        Create a new incident.
        """

        incident = serializer.save()

        from incidents.tasks import send_incident_notification

        # Send notification asynchronously
        send_incident_notification.delay(
            incident.id,
        )

        AuditLogService.create_log(
            user=incident.created_by,
            incident=incident,
            action=AuditAction.CREATED,
            description=f"Created incident {incident.incident_id}.",
        )

        IncidentService._refresh_dashboard()

        return incident

    @staticmethod
    def update_incident(serializer):
        """
        Update an existing incident.
        """

        incident = serializer.save()

        AuditLogService.create_log(
            user=incident.created_by,
            incident=incident,
            action=AuditAction.UPDATED,
            description=f"Updated incident {incident.incident_id}.",
        )

        IncidentService._refresh_dashboard()

        return incident

    @staticmethod
    def assign_incident(incident, assigned_to):
        """
        Assign an incident to a SOC Analyst.
        """

        incident.assigned_to = assigned_to
        incident.save(
            update_fields=["assigned_to"]
        )

        AuditLogService.create_log(
            user=incident.created_by,
            incident=incident,
            action=AuditAction.ASSIGNED,
            description=(
                f"Assigned incident {incident.incident_id} "
                f"to {assigned_to.full_name}."
            ),
        )

        IncidentService._refresh_dashboard()

        return incident

    @staticmethod
    def change_status(incident, status):
        """
        Change incident status.
        """

        old_status = incident.status

        incident.status = status
        incident.save(
            update_fields=["status"]
        )

        AuditLogService.create_log(
            user=incident.created_by,
            incident=incident,
            action=AuditAction.STATUS_CHANGED,
            description=(
                f"Changed status of {incident.incident_id} "
                f"from {old_status} to {incident.status}."
            ),
        )

        IncidentService._refresh_dashboard()

        return incident

    @staticmethod
    def close_incident(incident):
        """
        Close an incident.
        """

        old_status = incident.status

        incident.status = IncidentStatus.CLOSED
        incident.save(
            update_fields=["status"]
        )

        AuditLogService.create_log(
            user=incident.created_by,
            incident=incident,
            action=AuditAction.STATUS_CHANGED,
            description=(
                f"Closed incident {incident.incident_id}. "
                f"Status changed from {old_status} "
                f"to {IncidentStatus.CLOSED}."
            ),
        )

        IncidentService._refresh_dashboard()

        return incident