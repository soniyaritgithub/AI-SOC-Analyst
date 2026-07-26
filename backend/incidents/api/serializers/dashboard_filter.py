from accounts.models import User
from incidents.models import IncidentSeverity, IncidentStatus
from rest_framework import serializers


class DashboardFilterSerializer(serializers.Serializer):
    """
    Dashboard filters.
    """

    severity = serializers.ChoiceField(
        choices=IncidentSeverity.choices,
        required=False,
    )

    status = serializers.ChoiceField(
        choices=IncidentStatus.choices,
        required=False,
    )

    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
    )

    start_date = serializers.DateField(
        required=False,
    )

    end_date = serializers.DateField(
        required=False,
    )