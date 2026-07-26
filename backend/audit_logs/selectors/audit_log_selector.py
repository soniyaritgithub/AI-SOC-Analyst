from audit_logs.models import AuditLog
from django.db.models import Count, Q


class AuditLogSelector:
    """
    Selector class for fetching Audit Logs.
    """
    @staticmethod
    def get_recent_logs(limit=10):
        """
        Get recent audit logs.
        """
        return (
            AuditLog.objects.select_related(
                "user",
                "incident",
            )
            .order_by("-created_at")[:limit]
        )
    @staticmethod
    def get_statistics():
        """
        Get audit log statistics.
        """

        queryset = AuditLog.objects.all()

        return queryset.aggregate(
            total_logs=Count("id"),
            created=Count(
                "id",
                filter=Q(action="CREATED"),
            ),
            updated=Count(
                "id",
                filter=Q(action="UPDATED"),
            ),
            assigned=Count(
                "id",
                filter=Q(action="ASSIGNED"),
            ),
            status_changed=Count(
                "id",
                filter=Q(action="STATUS_CHANGED"),
            ),
            deleted=Count(
                "id",
                filter=Q(action="DELETED"),
            ),
        )
    @staticmethod
    def get_by_id(id):
        """
        Get audit log by ID.
        """
        return AuditLog.objects.select_related(
            "user",
            "incident",
        ).get(
            id=id,
        )
    @staticmethod
    def get_all():
        """
        Get all audit logs.
        """
        return AuditLog.objects.select_related(
            "user",
            "incident",
        ).all()

    @staticmethod
    def get_by_user(user):
        """
        Get audit logs by user.
        """
        return AuditLog.objects.select_related(
            "user",
            "incident",
        ).filter(
            user=user,
        )

    @staticmethod
    def get_by_incident(incident):
        """
        Get audit logs by incident.
        """
        return AuditLog.objects.select_related(
            "user",
            "incident",
        ).filter(
            incident=incident,
        )

    @staticmethod
    def get_by_action(action):
        """
        Get audit logs by action.
        """
        return AuditLog.objects.select_related(
            "user",
            "incident",
        ).filter(
            action=action,
        )