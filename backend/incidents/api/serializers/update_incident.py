from accounts.models import UserRole
from django.contrib.auth import get_user_model
from incidents.models import Incident
from rest_framework import serializers

User = get_user_model()


class UpdateIncidentSerializer(serializers.ModelSerializer):
    """
    Serializer for updating incidents.
    """

    class Meta:
        model = Incident
        fields = [
            "title",
            "description",
            "severity",
            "status",
            "assigned_to",
        ]

    def validate_assigned_to(self, value):
        if value.role != UserRole.SOC_ANALYST:
            raise serializers.ValidationError(
                "Incident can only be assigned to a SOC Analyst."
            )
        return value