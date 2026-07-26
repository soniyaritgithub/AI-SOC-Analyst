from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User

        fields = [
            "email",
            "full_name",
            "department",
            "phone_number",
            "password",
            "confirm_password",
        ]

    def validate(self, attrs):
        if (
            attrs["password"]
            != attrs["confirm_password"]
        ):
            raise serializers.ValidationError(
                {
                    "confirm_password":
                        "Passwords do not match."
                }
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop(
            "confirm_password"
        )

        password = validated_data.pop(
            "password"
        )

        user = User(
            **validated_data
        )

        user.role = "SOC_ANALYST"

        user.set_password(password)

        user.save()

        return user