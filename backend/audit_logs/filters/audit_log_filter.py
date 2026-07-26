import django_filters
from audit_logs.models import AuditLog


class AuditLogFilter(django_filters.FilterSet):
    """
    FilterSet for Audit Logs.
    """

    incident = django_filters.CharFilter(
        field_name="incident__incident_id",
        lookup_expr="icontains",
    )

    created_after = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__gte",
    )

    created_before = django_filters.DateFilter(
        field_name="created_at",
        lookup_expr="date__lte",
    )

    class Meta:
        model = AuditLog
        fields = [
            "action",
            "user",
            "incident",
        ]