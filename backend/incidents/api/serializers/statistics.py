from rest_framework import serializers


class IncidentStatisticsSerializer(serializers.Serializer):
    """
    Serializer for Incident Statistics.
    """

    total_incidents = serializers.IntegerField()

    open = serializers.IntegerField()

    in_progress = serializers.IntegerField()

    resolved = serializers.IntegerField()

    closed = serializers.IntegerField()