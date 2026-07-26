from incidents.models import IncidentStatus
from rest_framework import serializers


class ChangeIncidentStatusSerializer(serializers.Serializer):
    """
    Serializer for changing incident status.
    """

    status = serializers.ChoiceField(
        choices=IncidentStatus.choices
    )