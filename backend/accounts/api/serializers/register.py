from accounts.services.auth_service import AuthService
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = User

        fields = (
            "email",
            "full_name",
            "department",
            "phone_number",
            "password",
            "confirm_password",
        )

        extra_kwargs = {
            "password": {
                "write_only": True,
            },
            "department": {
                "required": False,
                "allow_blank": True,
            },
            "phone_number": {
                "required": False,
                "allow_blank": True,
            },
        }

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(
            email__iexact=value,
        ).exists():
            raise serializers.ValidationError(
                "Email already exists.",
            )

        return value

    def validate(self, attrs):
        if (
            attrs["password"]
            != attrs["confirm_password"]
        ):
            raise serializers.ValidationError(
                {
                    "confirm_password":
                        "Passwords do not match.",
                },
            )

        return attrs

    def create(self, validated_data):
        validated_data["role"] = "SOC_ANALYST"

        return AuthService.register_user(
            validated_data,
        )