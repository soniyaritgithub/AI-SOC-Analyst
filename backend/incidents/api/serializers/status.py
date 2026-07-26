from rest_framework import serializers


class IncidentStatusSerializer(serializers.Serializer):
    """
    Serializer for Incident Status Distribution.
    """

    status = serializers.CharField()

    count = serializers.IntegerField()