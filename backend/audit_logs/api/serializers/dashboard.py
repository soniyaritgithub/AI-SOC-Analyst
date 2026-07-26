from rest_framework import serializers

from .audit_log import AuditLogSerializer
from .statistics import AuditLogStatisticsSerializer


class AuditLogDashboardSerializer(serializers.Serializer):
    """
    Serializer for Audit Log Dashboard.
    """

    statistics = AuditLogStatisticsSerializer()
    recent_logs = AuditLogSerializer(many=True)