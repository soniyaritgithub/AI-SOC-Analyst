import ipaddress
from datetime import time


class SuspiciousLoginService:
    """
    Detect suspicious characteristics in authentication events.

    This service only performs detection.
    Incident creation is handled separately.
    """

    DEFAULT_START_HOUR = 6
    DEFAULT_END_HOUR = 23

    @staticmethod
    def _is_valid_ip(ip_address):
        """
        Check whether the supplied IP address is valid.
        """
        if not ip_address:
            return False

        try:
            ipaddress.ip_address(str(ip_address).strip())
            return True
        except ValueError:
            return False

    @classmethod
    def detect_unusual_time(cls, login_time):
        """
        Detect logins occurring outside normal hours.

        Normal login window:
        06:00 <= time < 23:00
        """
        if login_time is None:
            return False

        if hasattr(login_time, "time"):
            login_time = login_time.time()

        if not isinstance(login_time, time):
            return False

        start_time = time(cls.DEFAULT_START_HOUR, 0)
        end_time = time(cls.DEFAULT_END_HOUR, 0)

        return not (
            start_time <= login_time < end_time
        )

    @classmethod
    def detect_private_ip_anomaly(cls, ip_address):
        """
        Detect invalid or otherwise suspicious IP values.

        Private IP addresses themselves are not considered
        malicious because internal SOC traffic commonly uses them.
        """
        if not cls._is_valid_ip(ip_address):
            return True

        return False

    @classmethod
    def analyze(cls, event):
        """
        Analyze a login event.

        Expected event example:

        {
            "username": "analyst@example.com",
            "ip_address": "203.0.113.10",
            "login_time": datetime(...),
            "login_success": True
        }

        Returns:
        {
            "is_suspicious": True/False,
            "reasons": [...],
            "risk_score": 0-100
        }
        """

        if not isinstance(event, dict):
            return {
                "is_suspicious": False,
                "reasons": [],
                "risk_score": 0,
            }

        reasons = []
        risk_score = 0

        login_time = event.get("login_time")
        ip_address = event.get("ip_address")
        login_success = event.get("login_success")

        if cls.detect_unusual_time(login_time):
            reasons.append("Login occurred outside normal hours.")
            risk_score += 40

        if cls.detect_private_ip_anomaly(ip_address):
            reasons.append("Login contains an invalid IP address.")
            risk_score += 40

        if login_success is False:
            reasons.append("Login attempt failed.")
            risk_score += 20

        risk_score = min(risk_score, 100)

        return {
            "is_suspicious": risk_score >= 40,
            "reasons": reasons,
            "risk_score": risk_score,
        }