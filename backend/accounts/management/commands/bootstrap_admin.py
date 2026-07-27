import os

from accounts.models import UserRole
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()


class Command(BaseCommand):
    help = (
        "Create or update the initial production admin "
        "using environment variables."
    )

    def handle(self, *args, **options):
        email = os.getenv(
            "BOOTSTRAP_ADMIN_EMAIL",
            "",
        ).strip().lower()

        password = os.getenv(
            "BOOTSTRAP_ADMIN_PASSWORD",
            "",
        )

        full_name = os.getenv(
            "BOOTSTRAP_ADMIN_FULL_NAME",
            "SOC Administrator",
        ).strip()

        if not email and not password:
            self.stdout.write(
                self.style.WARNING(
                    "Admin bootstrap skipped: "
                    "BOOTSTRAP_ADMIN_EMAIL and "
                    "BOOTSTRAP_ADMIN_PASSWORD are not configured."
                )
            )
            return

        if not email:
            raise CommandError(
                "BOOTSTRAP_ADMIN_EMAIL is required."
            )

        if not password:
            raise CommandError(
                "BOOTSTRAP_ADMIN_PASSWORD is required."
            )

        if len(password) < 8:
            raise CommandError(
                "BOOTSTRAP_ADMIN_PASSWORD must contain "
                "at least 8 characters."
            )

        if not full_name:
            full_name = "SOC Administrator"

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "full_name": full_name,
                "role": UserRole.ADMIN,
                "is_active": True,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        changed_fields = []

        if user.full_name != full_name:
            user.full_name = full_name
            changed_fields.append("full_name")

        if user.role != UserRole.ADMIN:
            user.role = UserRole.ADMIN
            changed_fields.append("role")

        if not user.is_active:
            user.is_active = True
            changed_fields.append("is_active")

        if not user.is_staff:
            user.is_staff = True
            changed_fields.append("is_staff")

        if not user.is_superuser:
            user.is_superuser = True
            changed_fields.append("is_superuser")

        if created:
            user.set_password(password)
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Production admin created: {email}"
                )
            )
            return

        if changed_fields:
            user.save(
                update_fields=[
                    *changed_fields,
                    "updated_at",
                ]
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Production admin already exists: {email}"
            )
        )