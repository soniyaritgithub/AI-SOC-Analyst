from accounts.models import UserRole
from django.contrib.auth import get_user_model
from incidents.models import Incident
from rest_framework import serializers

User = get_user_model()


class CreateIncidentSerializer(serializers.ModelSerializer):
    """
    Serializer for creating incidents.
    """

    class Meta:
        model = Incident
        fields = [
            "title",
            "description",
            "severity",
            "assigned_to",
        ]

    def validate_assigned_to(self, value):
        """
        Only SOC Analysts can be assigned incidents.
        """

        if value.role != UserRole.SOC_ANALYST:
            raise serializers.ValidationError(
                "Incident can only be assigned to a SOC Analyst."
            )

        return value

    def create(self, validated_data):
        """
        Automatically set created_by.
        """

        validated_data["created_by"] = (
            self.context["request"].user
        )

        return super().create(validated_data)