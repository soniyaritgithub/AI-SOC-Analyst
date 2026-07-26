from typing import Any, cast

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthService:
    @staticmethod
    def register_user(validated_data):
        """
        Create a new user with a hashed password.
        """
        validated_data.pop("confirm_password", None)

        user = User.objects.create_user(**validated_data)

        return user

    @staticmethod
    def login_user(user):
        """
        Generate JWT tokens for authenticated user.
        """
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
            },
        }

    @staticmethod
    def logout_user(refresh_token: str):
        """
        Blacklist refresh token.
        """
        token = cast(Any, RefreshToken(refresh_token))  # type: ignore[arg-type]
        token.blacklist()

        return {
            "message": "Logout successful.",
        }

    @staticmethod
    def change_password(user, validated_data):
        """
        Change authenticated user's password.
        """

        current_password = validated_data["current_password"]
        new_password = validated_data["new_password"]

        if not user.check_password(current_password):
            raise serializers.ValidationError(
                {
                    "current_password": [
                        "Current password is incorrect."
                    ]
                }
            )

        # Securely hash the new password
        user.set_password(new_password)

        # Save only the password field
        user.save(update_fields=["password"])

        return {
            "message": "Password changed successfully."
        }

    @staticmethod
    def forgot_password(validated_data):
        """
        Generate password reset token and send reset email.
        """

        email = validated_data["email"]

        user = User.objects.get(email=email)

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = PasswordResetTokenGenerator().make_token(user)

        reset_url = (
            f"http://localhost:5173/"
            f"reset-password/"
            f"{uid}/"
            f"{token}/"
        )

        send_mail(
            subject="AI SOC Analyst - Password Reset",
            message=(
                f"Hello,\n\n"
                f"Click the link below to reset your password:\n\n"
                f"{reset_url}\n\n"
                "If you did not request this password reset, "
                "please ignore this email."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return {
            "message": (
                "Password reset link has been sent to your email."
            )
        }

    @staticmethod
    def reset_password(validated_data):
        """
        Reset user password using UID and token.
        """

        uid = validated_data["uid"]
        token = validated_data["token"]
        new_password = validated_data["new_password"]

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(pk=user_id)

        except (
            User.DoesNotExist,
            ValueError,
            TypeError,
            OverflowError,
        ):
            raise serializers.ValidationError(
                {
                    "uid": [
                        "Invalid password reset link."
                    ]
                }
            )

        token_generator = PasswordResetTokenGenerator()

        if not token_generator.check_token(user, token):
            raise serializers.ValidationError(
                {
                    "token": [
                        "Password reset link is invalid or has expired."
                    ]
                }
            )

        user.set_password(new_password)

        user.save(update_fields=["password"])

        return {
            "message": "Password has been reset successfully."
        }