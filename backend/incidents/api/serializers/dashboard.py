from rest_framework import serializers

from .analyst import IncidentAnalystSerializer
from .list_incident import IncidentListSerializer
from .severity import IncidentSeveritySerializer
from .statistics import IncidentStatisticsSerializer
from .status import IncidentStatusSerializer
from .trend import IncidentTrendSerializer


class IncidentDashboardSerializer(serializers.Serializer):
    """
    Serializer for Incident Dashboard.
    """

    statistics = IncidentStatisticsSerializer()

    severity_distribution = IncidentSeveritySerializer(
        many=True,
    )

    status_distribution = IncidentStatusSerializer(
        many=True,
    )

    analyst_performance = IncidentAnalystSerializer(
        many=True,
    )

    monthly_trends = IncidentTrendSerializer(
        many=True,
    )

    recent_incidents = IncidentListSerializer(
        many=True,
    )