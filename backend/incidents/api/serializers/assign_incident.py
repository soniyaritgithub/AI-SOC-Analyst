from accounts.models import UserRole
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class AssignIncidentSerializer(serializers.Serializer):
    """
    Serializer for assigning incidents.
    """

    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(
            role=UserRole.SOC_ANALYST,
            is_active=True,
        )
    )