from rest_framework import serializers


class IncidentSeveritySerializer(serializers.Serializer):
    """
    Serializer for Incident Severity Distribution.
    """

    severity = serializers.CharField()

    count = serializers.IntegerField()