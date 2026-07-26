from incidents.models import Incident
from rest_framework import serializers


class IncidentListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing incidents.
    """

    assigned_to = serializers.CharField(
        source="assigned_to.full_name",
        read_only=True,
    )

    created_by = serializers.CharField(
        source="created_by.full_name",
        read_only=True,
    )

    class Meta:
        model = Incident
        fields = [
            "id",
            "incident_id",
            "title",
            "severity",
            "status",
            "assigned_to",
            "created_by",
            "created_at",
        ]