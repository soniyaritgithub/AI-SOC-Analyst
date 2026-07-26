from django.contrib import admin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "action",
        "user",
        "incident",
        "created_at",
    )

    list_filter = (
        "action",
        "created_at",
    )

    search_fields = (
        "user__full_name",
        "incident__incident_id",
        "description",
    )

    ordering = (
        "-created_at",
    )