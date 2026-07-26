from datetime import datetime, timedelta


class BruteForceDetectionService:
    """
    Detect repeated failed login attempts within a time window.

    This service performs detection only.
    Incident creation will be handled separately.
    """

    DEFAULT_THRESHOLD = 5
    DEFAULT_WINDOW_MINUTES = 10

    @staticmethod
    def _parse_timestamp(timestamp):
        """
        Convert a supported timestamp into a datetime object.
        """

        if isinstance(timestamp, datetime):
            return timestamp

        if isinstance(timestamp, str):
            try:
                return datetime.fromisoformat(
                    timestamp.replace("Z", "+00:00")
                )
            except ValueError:
                return None

        return None

    @classmethod
    def analyze(
        cls,
        login_attempts,
        threshold=None,
        window_minutes=None,
    ):
        """
        Analyze login attempts for brute-force behavior.

        Expected login attempt:

        {
            "username": "admin@example.com",
            "ip_address": "203.0.113.10",
            "login_success": False,
            "timestamp": datetime(...)
        }
        """

        threshold = (
            threshold
            if threshold is not None
            else cls.DEFAULT_THRESHOLD
        )

        window_minutes = (
            window_minutes
            if window_minutes is not None
            else cls.DEFAULT_WINDOW_MINUTES
        )

        if not isinstance(login_attempts, list):
            return cls._empty_result(
                threshold,
                window_minutes,
            )

        if threshold <= 0 or window_minutes <= 0:
            return cls._empty_result(
                threshold,
                window_minutes,
            )

        failed_attempts = []

        for attempt in login_attempts:
            if not isinstance(attempt, dict):
                continue

            if attempt.get("login_success") is not False:
                continue

            timestamp = cls._parse_timestamp(
                attempt.get("timestamp")
            )

            if timestamp is None:
                continue

            failed_attempts.append(
                {
                    "username": attempt.get("username"),
                    "ip_address": attempt.get("ip_address"),
                    "timestamp": timestamp,
                }
            )

        if not failed_attempts:
            return cls._empty_result(
                threshold,
                window_minutes,
            )

        failed_attempts.sort(
            key=lambda item: item["timestamp"]
        )

        suspicious_groups = []

        grouped_attempts = {}

        for attempt in failed_attempts:
            key = (
                attempt["username"],
                attempt["ip_address"],
            )

            grouped_attempts.setdefault(
                key,
                [],
            ).append(attempt)

        window = timedelta(
            minutes=window_minutes
        )

        for (
            username,
            ip_address,
        ), attempts in grouped_attempts.items():

            left = 0

            for right in range(len(attempts)):
                while (
                    attempts[right]["timestamp"]
                    - attempts[left]["timestamp"]
                    > window
                ):
                    left += 1

                attempt_count = right - left + 1

                if attempt_count >= threshold:
                    suspicious_groups.append(
                        {
                            "username": username,
                            "ip_address": ip_address,
                            "failed_attempts": attempt_count,
                            "first_attempt": (
                                attempts[left][
                                    "timestamp"
                                ].isoformat()
                            ),
                            "last_attempt": (
                                attempts[right][
                                    "timestamp"
                                ].isoformat()
                            ),
                        }
                    )

                    break

        return {
            "is_brute_force": bool(
                suspicious_groups
            ),
            "threshold": threshold,
            "window_minutes": window_minutes,
            "total_failed_attempts": len(
                failed_attempts
            ),
            "detections": suspicious_groups,
        }

    @staticmethod
    def _empty_result(
        threshold,
        window_minutes,
    ):
        return {
            "is_brute_force": False,
            "threshold": threshold,
            "window_minutes": window_minutes,
            "total_failed_attempts": 0,
            "detections": [],
        }