from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing the authenticated user's password.
    """

    current_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    new_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
    )

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords do not match."
                }
            )

        validate_password(attrs["new_password"])

        return attrs