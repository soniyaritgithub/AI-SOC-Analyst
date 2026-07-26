from rest_framework import serializers


class HealthStatusSerializer(serializers.Serializer):
    """
    Serializer for individual health checks.
    """

    status = serializers.CharField()
    message = serializers.CharField()


class HealthSerializer(serializers.Serializer):
    """
    Serializer for system health response.
    """

    status = serializers.CharField()

    database = HealthStatusSerializer()

    redis = HealthStatusSerializer()

    cache = HealthStatusSerializer()

    response_time_ms = serializers.FloatField()