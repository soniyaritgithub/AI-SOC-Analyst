from django.core.cache import cache

CACHE_PATTERNS = [
    "ai_soc:incident_statistics_*",
    "ai_soc:incident_severity_distribution_*",
    "ai_soc:incident_status_distribution_*",
    "ai_soc:incident_analyst_performance_*",
    "ai_soc:incident_monthly_trends_*",
]


def clear_dashboard_cache():
    """
    Clear all dashboard analytics cache.
    """

    for pattern in CACHE_PATTERNS:
        cache.delete_pattern(pattern)