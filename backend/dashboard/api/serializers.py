from incidents.models import Incident
from rest_framework import serializers


class IncidentCardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Incident
        fields = (
            "incident_id",
            "title",
            "severity",
            "status",
            "created_at",
        )


class DashboardSerializer(serializers.Serializer):

    total_incidents = serializers.IntegerField()

    open_incidents = serializers.IntegerField()
    in_progress_incidents = serializers.IntegerField()
    resolved_incidents = serializers.IntegerField()
    closed_incidents = serializers.IntegerField()

    critical_incidents = serializers.IntegerField()
    high_incidents = serializers.IntegerField()
    medium_incidents = serializers.IntegerField()
    low_incidents = serializers.IntegerField()

    active_analysts = serializers.IntegerField()

    recent_incidents = IncidentCardSerializer(
        many=True,
    )

    latest_alerts = IncidentCardSerializer(
        many=True,
    )