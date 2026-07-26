from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class ResetPasswordSerializer(serializers.Serializer):
    """
    Serializer for resetting password using UID and token.
    """

    uid = serializers.CharField()

    token = serializers.CharField()

    new_password = serializers.CharField(
        write_only=True,
    )

    confirm_password = serializers.CharField(
        write_only=True,
    )

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": [
                        "Passwords do not match."
                    ]
                }
            )

        validate_password(attrs["new_password"])

        return attrs