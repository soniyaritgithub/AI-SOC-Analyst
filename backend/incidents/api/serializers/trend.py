from rest_framework import serializers


class IncidentTrendSerializer(serializers.Serializer):
    """
    Serializer for Monthly Incident Trends.
    """

    month = serializers.DateTimeField(
        format="%b %Y",
        read_only=True,
    )

    count = serializers.IntegerField()