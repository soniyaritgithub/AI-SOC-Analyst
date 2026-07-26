import logging

from django.core.cache import cache

logger = logging.getLogger(__name__)


class CacheHelper:
    """
    Enterprise cache helper.
    """

    @staticmethod
    def get(key):
        """
        Get value from cache.
        """

        try:
            value = cache.get(key)

            if value is None:
                logger.info(
                    f"Cache MISS: {key}"
                )
            else:
                logger.info(
                    f"Cache HIT: {key}"
                )

            return value

        except Exception as exc:
            logger.exception(
                f"Redis GET failed: {exc}"
            )

            return None

    @staticmethod
    def set(key, value, timeout=None):
        """
        Save value into cache.
        """

        try:
            cache.set(
                key,
                value,
                timeout,
            )

            logger.info(
                f"Cache SET: {key}"
            )

        except Exception as exc:
            logger.exception(
                f"Redis SET failed: {exc}"
            )

    @staticmethod
    def delete(key):
        """
        Delete cache key.
        """

        try:
            cache.delete(key)

            logger.info(
                f"Cache DELETE: {key}"
            )

        except Exception as exc:
            logger.exception(
                f"Redis DELETE failed: {exc}"
            )

    @staticmethod
    def delete_pattern(pattern):
        """
        Delete cache keys by pattern.
        """

        try:
            if hasattr(cache, "delete_pattern"):
                cache.delete_pattern(pattern)

                logger.info(
                    f"Cache DELETE PATTERN: {pattern}"
                )

        except Exception as exc:
            logger.exception(
                f"Redis DELETE_PATTERN failed: {exc}"
            )

    @staticmethod
    def clear():
        """
        Clear entire cache.
        """

        try:
            cache.clear()

            logger.info(
                "Cache CLEAR"
            )

        except Exception as exc:
            logger.exception(
                f"Redis CLEAR failed: {exc}"
            )