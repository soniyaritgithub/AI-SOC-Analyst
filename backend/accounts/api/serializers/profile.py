from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for authenticated user profile.
    """

    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "full_name",
            "department",
            "phone_number",
            "role",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields