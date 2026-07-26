from audit_logs.models import AuditLog
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers


class AuditLogSerializer(serializers.ModelSerializer):
    """
    Serializer for Audit Logs.
    """

    user = serializers.CharField(
        source="user.full_name",
        read_only=True,
    )

    incident = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = (
            "id",
            "user",
            "incident",
            "action",
            "description",
            "created_at",
        )

    @extend_schema_field(
        serializers.CharField(
            allow_null=True,
        )
    )
    def get_incident(self, obj):
        if obj.incident:
            return obj.incident.incident_id

        return None