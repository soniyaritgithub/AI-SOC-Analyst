import platform
import time

from django.conf import settings
from django.core.cache import cache
from django.db import connection


class MonitoringService:
    """
    Service responsible for collecting
    production monitoring metrics.
    """

    @staticmethod
    def get_redis_metrics():
        """
        Collect Redis monitoring metrics.
        """

        try:
            redis = cache.client.get_client(write=True)

            info = redis.info()

            return {
                "status": "healthy",
                "version": info.get("redis_version"),
                "uptime_seconds": info.get("uptime_in_seconds"),
                "connected_clients": info.get("connected_clients"),
                "used_memory": info.get("used_memory_human"),
                "used_memory_peak": info.get("used_memory_peak_human"),
                "total_commands_processed": info.get("total_commands_processed"),
                "expired_keys": info.get("expired_keys"),
                "evicted_keys": info.get("evicted_keys"),
            }

        except Exception as exc:
            return {
                "status": "unhealthy",
                "message": str(exc),
            }

    @staticmethod
    def get_cache_metrics():
        """
        Collect cache metrics.
        """

        return {
            "status": "healthy",
            "metrics": {},
        }

    @staticmethod
    def get_database_metrics():
        """
        Collect database metrics.
        """

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")

            return {
                "status": "healthy",
                "engine": settings.DATABASES["default"]["ENGINE"],
                "database": settings.DATABASES["default"]["NAME"],
            }

        except Exception as exc:
            return {
                "status": "unhealthy",
                "message": str(exc),
            }

    @staticmethod
    def get_system_metrics():
        """
        Collect application metrics.
        """

        return {
            "python_version": platform.python_version(),
            "django_version": platform.python_implementation(),
            "platform": platform.platform(),
        }

    @staticmethod
    def get_monitoring_report():
        """
        Generate complete monitoring report.
        """

        start = time.perf_counter()

        report = {
            "redis": MonitoringService.get_redis_metrics(),
            "cache": MonitoringService.get_cache_metrics(),
            "database": MonitoringService.get_database_metrics(),
            "system": MonitoringService.get_system_metrics(),
        }

        report["response_time_ms"] = round(
            (time.perf_counter() - start) * 1000,
            2,
        )

        return report