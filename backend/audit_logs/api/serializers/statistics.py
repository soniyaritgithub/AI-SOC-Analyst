from rest_framework import serializers


class AuditLogStatisticsSerializer(serializers.Serializer):
    """
    Serializer for Audit Log Statistics.
    """

    total_logs = serializers.IntegerField()
    created = serializers.IntegerField()
    updated = serializers.IntegerField()
    assigned = serializers.IntegerField()
    status_changed = serializers.IntegerField()
    deleted = serializers.IntegerField()