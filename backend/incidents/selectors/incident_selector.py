import hashlib
import json

from common.cache import CacheHelper
from django.conf import settings
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from incidents.models import Incident, IncidentStatus


class IncidentSelector:
    """
    Selector layer for Incident database queries.
    """

    @staticmethod
    def build_cache_key(prefix, queryset=None):
        """
        Build a unique cache key based on the queryset SQL.
        """

        if queryset is None:
            return prefix

        sql = str(queryset.query)

        query_hash = hashlib.md5(
            sql.encode("utf-8")
        ).hexdigest()

        return f"{prefix}_{query_hash}"

    @staticmethod
    def get_dashboard():
        """
        Return dashboard data.
        """

        return {
            "statistics": IncidentSelector.get_statistics(),
            "severity_distribution": IncidentSelector.get_severity_distribution(),
            "status_distribution": IncidentSelector.get_status_distribution(),
            "analyst_performance": IncidentSelector.get_analyst_performance(),
            "monthly_trends": IncidentSelector.get_monthly_trends(),
            "recent_incidents": (
                Incident.objects
                .select_related(
                    "assigned_to",
                    "created_by",
                )
                .only(
                    "id",
                    "incident_id",
                    "title",
                    "severity",
                    "status",
                    "created_at",
                    "assigned_to__full_name",
                    "created_by__full_name",
                )
                .order_by("-created_at")[:10]
            ),
        }
    
    @staticmethod
    def get_filtered_queryset(filters):
        """
        Apply dashboard filters.
        """

        queryset = Incident.objects.all()

        severity = filters.get("severity")

        if severity:
            queryset = queryset.filter(
                severity=severity,
            )

        status = filters.get("status")

        if status:
            queryset = queryset.filter(
                status=status,
            )

        assigned_to = filters.get("assigned_to")

        if assigned_to:
            queryset = queryset.filter(
                assigned_to=assigned_to,
            )

        start_date = filters.get("start_date")

        if start_date:
            queryset = queryset.filter(
                created_at__date__gte=start_date,
            )

        end_date = filters.get("end_date")

        if end_date:
            queryset = queryset.filter(
                created_at__date__lte=end_date,
            )

        return queryset

    @staticmethod
    def get_monthly_trends(queryset=None):
        """
        Return monthly incident trends.
        """
        cache_key = IncidentSelector.build_cache_key(
            "incident_monthly_trends",
            queryset,
        )

        cached_data = CacheHelper.get(cache_key)

        if cached_data is not None:
            return cached_data

        if queryset is None:
            queryset = Incident.objects.all()

        monthly_trends = list(
            queryset
            .annotate(
                month=TruncMonth("created_at"),
            )
            .values("month")
            .annotate(
                count=Count("id"),
            )
            .order_by("month")
        )
        CacheHelper.set(
            cache_key,
            monthly_trends,
            timeout=settings.TREND_CACHE_TTL,
        )

        return monthly_trends

    @staticmethod
    def get_analyst_performance(queryset=None):
        """
        Return incident count grouped by assigned analyst.
        """
        cache_key = IncidentSelector.build_cache_key(
            "incident_analyst_performance",
            queryset,
        )

        cached_data = CacheHelper.get(cache_key)

        if cached_data is not None:
            return cached_data

        if queryset is None:
            queryset = Incident.objects.all()

        analyst_performance = []

        data = (
            queryset
            .values("assigned_to__full_name")
            .annotate(
                count=Count("id"),
            )
            .order_by("-count")
        )

        for item in data:
            analyst_performance.append(
                {
                    "analyst": item["assigned_to__full_name"] or "Unassigned",
                    "total_incidents": item["count"],
                }
            )

        CacheHelper.set(
            cache_key,
            analyst_performance,
            timeout=settings.ANALYST_CACHE_TTL,
        )

        return analyst_performance

    @staticmethod
    def get_status_distribution(queryset=None):
        """
        Return incident count grouped by status.
        """
        cache_key = IncidentSelector.build_cache_key(
            "incident_status_distribution",
            queryset,
        )

        cached_data = CacheHelper.get(cache_key)

        if cached_data is not None:
            return cached_data

        if queryset is None:
            queryset = Incident.objects.all()

        status_distribution = list(
            queryset
            .values("status")
            .annotate(
                count=Count("id"),
            )
            .order_by("status")
        )
        CacheHelper.set(
            cache_key,
            status_distribution,
            timeout=settings.STATUS_CACHE_TTL,
        )

        return status_distribution

    @staticmethod
    def get_severity_distribution(queryset=None):
        """
        Return incident count grouped by severity.
        """
        cache_key = IncidentSelector.build_cache_key(
            "incident_severity_distribution",
            queryset,
        )

        cached_data = CacheHelper.get(cache_key)

        if cached_data is not None:
            return cached_data

        if queryset is None:
            queryset = Incident.objects.all()

        severity_distribution = list(
            queryset
            .values("severity")
            .annotate(
                count=Count("id"),
            )
            .order_by("severity")
        )
        CacheHelper.set(
            cache_key,
            severity_distribution,
            timeout=settings.SEVERITY_CACHE_TTL,
        )

        return severity_distribution

    @staticmethod
    def get_statistics(queryset=None):
        """
        Return incident statistics for dashboard.
        """
        cache_key = IncidentSelector.build_cache_key(
            "incident_statistics",
            queryset,
        )

        cached_data = CacheHelper.get(cache_key)

        if cached_data is not None:
            return cached_data

        if queryset is None:
            queryset = Incident.objects.all()

        statistics = queryset.aggregate(
            total_incidents=Count("id"),

            open=Count(
                "id",
                filter=Q(status=IncidentStatus.OPEN),
            ),

            in_progress=Count(
                "id",
                filter=Q(status=IncidentStatus.IN_PROGRESS),
            ),

            resolved=Count(
                "id",
                filter=Q(status=IncidentStatus.RESOLVED),
            ),

            closed=Count(
                "id",
                filter=Q(status=IncidentStatus.CLOSED),
            ),
        )

        CacheHelper.set(
            cache_key,
            statistics,
            timeout=settings.STATISTICS_CACHE_TTL,
        )

        return statistics

    @staticmethod
    def get_all():
        """
        Return all incidents.
        """
        return (
            Incident.objects
            .select_related(
                "assigned_to",
                "created_by",
            )
            .only(
                "id",
                "incident_id",
                "title",
                "severity",
                "status",
                "created_at",
                "assigned_to__full_name",
                "created_by__full_name",
            )
        )

    @staticmethod
    def get_by_id(pk):
        """
        Return incident by UUID.
        """
        return (
            Incident.objects
            .select_related(
                "assigned_to",
                "created_by",
            )
            .filter(id=pk)
            .first()
        )

    @staticmethod
    def get_by_incident_id(incident_id):
        """
        Return incident by Incident ID.
        """
        return (
            Incident.objects
            .select_related(
                "assigned_to",
                "created_by",
            )
            .filter(
                incident_id=incident_id
            )
            .first()
        )

    @staticmethod
    def get_by_severity(severity):
        """
        Return incidents by severity.
        """
        return (
            Incident.objects
            .select_related(
                "assigned_to",
                "created_by",
            )
            .filter(
                severity=severity
            )
        )

    @staticmethod
    def get_by_status(status):
        """
        Return incidents by status.
        """
        return (
            Incident.objects
            .select_related(
                "assigned_to",
                "created_by",
            )
            .filter(
                status=status
            )
        )

    @staticmethod
    def get_by_assigned_user(user):
        """
        Return incidents assigned to a user.
        """
        return (
            Incident.objects
            .select_related(
                "assigned_to",
                "created_by",
            )
            .filter(
                assigned_to=user
            )
        )