from detection.models import IOC, DetectionRule
from django.contrib import admin


@admin.register(DetectionRule)
class DetectionRuleAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "rule_type",
        "severity",
        "is_active",
        "created_at",
    )

    list_filter = (
        "rule_type",
        "severity",
        "is_active",
    )

    search_fields = (
        "name",
        "description",
        "pattern",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )
@admin.register(IOC)
class IOCAdmin(admin.ModelAdmin):
    list_display = (
        "value",
        "ioc_type",
        "severity",
        "source",
        "is_active",
        "created_at",
    )

    list_filter = (
        "ioc_type",
        "severity",
        "is_active",
    )

    search_fields = (
        "value",
        "description",
        "source",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )