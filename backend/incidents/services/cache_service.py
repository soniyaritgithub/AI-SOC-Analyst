from django.core.cache import cache


class CacheService:
    """
    Service for clearing dashboard-related cache.
    """

    CACHE_PREFIXES = [
        "incident_statistics",
        "incident_severity_distribution",
        "incident_status_distribution",
        "incident_analyst_performance",
        "incident_monthly_trends",
    ]

    @classmethod
    def clear_dashboard_cache(cls):
        """
        Clear all dashboard cache.
        """
        cache.clear()