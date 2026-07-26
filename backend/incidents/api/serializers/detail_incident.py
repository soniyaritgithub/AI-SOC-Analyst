from incidents.models import Incident
from rest_framework import serializers


class IncidentDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for incident details.
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
        fields = "__all__"