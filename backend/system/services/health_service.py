import time

from django.core.cache import cache
from django.db import connection


class HealthService:
    """
    Service responsible for checking system health.
    """

    @staticmethod
    def check_database():
        """
        Check database connectivity.
        """
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")

            return {
                "status": "healthy",
                "message": "Database connection successful.",
            }

        except Exception as exc:
            return {
                "status": "unhealthy",
                "message": str(exc),
            }

    @staticmethod
    def check_redis():
        """
        Check Redis connectivity.
        """
        try:
            redis = cache.client.get_client(write=True)

            redis.ping()

            return {
                "status": "healthy",
                "message": "Redis connection successful.",
            }

        except Exception as exc:
            return {
                "status": "unhealthy",
                "message": str(exc),
            }

    @staticmethod
    def check_cache():
        """
        Check cache read/write operations.
        """
        try:
            cache_key = "health_check"

            cache_value = "ok"

            cache.set(
                cache_key,
                cache_value,
                timeout=10,
            )

            value = cache.get(cache_key)

            cache.delete(cache_key)

            if value == cache_value:
                return {
                    "status": "healthy",
                    "message": "Cache is working properly.",
                }

            return {
                "status": "unhealthy",
                "message": "Cache validation failed.",
            }

        except Exception as exc:
            return {
                "status": "unhealthy",
                "message": str(exc),
            }

    @staticmethod
    def check_system():
        """
        Complete system health report.
        """
        start_time = time.perf_counter()

        database = HealthService.check_database()

        redis = HealthService.check_redis()

        cache_status = HealthService.check_cache()

        response_time = round(
            (time.perf_counter() - start_time) * 1000,
            2,
        )

        overall_status = (
            "healthy"
            if (
                database["status"] == "healthy"
                and redis["status"] == "healthy"
                and cache_status["status"] == "healthy"
            )
            else "unhealthy"
        )

        return {
            "status": overall_status,
            "database": database,
            "redis": redis,
            "cache": cache_status,
            "response_time_ms": response_time,
        }