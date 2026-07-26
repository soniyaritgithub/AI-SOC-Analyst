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
            "role",
            "password",
            "confirm_password",
        )

        extra_kwargs = {
            "password": {
                "write_only": True,
            }
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password":
                        "Passwords do not match."
                }
            )

        return attrs

    def create(self, validated_data):
      return AuthService.register_user(validated_data)