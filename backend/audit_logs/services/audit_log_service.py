from audit_logs.models import AuditLog


class AuditLogService:
    """
    Service class for creating audit logs.
    """

    @staticmethod
    def create_log(
        user,
        action,
        description,
        incident=None,
    ):
        """
        Create an audit log entry.
        """

        return AuditLog.objects.create(
            user=user,
            incident=incident,
            action=action,
            description=description,
        )