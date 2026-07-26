from rest_framework import serializers


class AssignmentAnalystSerializer(serializers.Serializer):
    """
    Serializer for analysts available for incident assignment.
    """

    id = serializers.UUIDField()
    full_name = serializers.CharField()
    email = serializers.EmailField()