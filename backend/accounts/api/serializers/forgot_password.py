from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class ForgotPasswordSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset email.
    """

    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "No account found with this email address."
            )

        return value