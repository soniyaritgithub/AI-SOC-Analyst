import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .managers import UserManager


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    SOC_ANALYST = "SOC_ANALYST", "SOC Analyst"
    MANAGER = "MANAGER", "Manager"


class User(AbstractBaseUser, PermissionsMixin):
    """
    Enterprise Custom User Model
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    email = models.EmailField(
        unique=True,
    )

    full_name = models.CharField(
        max_length=255,
    )

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.SOC_ANALYST,
    )

    department = models.CharField(
        max_length=100,
        blank=True,
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    is_staff = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = [
        "full_name",
    ]

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email