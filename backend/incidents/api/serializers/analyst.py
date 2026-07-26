from rest_framework import serializers


class IncidentAnalystSerializer(serializers.Serializer):
    """
    Serializer for Analyst Performance.
    """

    analyst = serializers.CharField()

    total_incidents = serializers.IntegerField()