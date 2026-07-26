import logging

from detection.services.auto_incident_service import AutoIncidentService
from detection.services.brute_force_service import BruteForceDetectionService
from detection.services.ioc_matching_service import IOCMatchingService
from detection.services.malware_detection_service import \
    MalwareDetectionService
from detection.services.suspicious_login_service import SuspiciousLoginService
from incidents.models import IncidentSeverity

logger = logging.getLogger(__name__)


class DetectionEngineService:
    """
    Central orchestration service for the SOC detection engine.

    It coordinates:
    - IOC matching
    - Suspicious login detection
    - Brute-force detection
    - Malware detection
    - Automatic incident creation
    """

    @classmethod
    def analyze_event(
        cls,
        event,
        login_attempts=None,
        create_incident=True,
    ):
        """
        Analyze a security event through all supported detectors.

        Args:
            event:
                Dictionary containing security-event data.

            login_attempts:
                Optional list of authentication attempts used
                by the brute-force detector.

            create_incident:
                If True, automatically create an incident when
                a threat is confirmed.

        Returns:
            Dictionary containing detection results and
            created incident information.
        """

        if not isinstance(event, dict):
            return cls._empty_result()

        login_attempts = (
            login_attempts
            if isinstance(login_attempts, list)
            else []
        )

        # --------------------------------------------------
        # IOC detection
        # --------------------------------------------------

        ioc_matches = IOCMatchingService.match_event(
            event
        )

        # --------------------------------------------------
        # Suspicious login detection
        # --------------------------------------------------

        suspicious_login = (
            SuspiciousLoginService.analyze(event)
        )

        # --------------------------------------------------
        # Brute-force detection
        # --------------------------------------------------

        brute_force = (
            BruteForceDetectionService.analyze(
                login_attempts
            )
        )

        # --------------------------------------------------
        # Malware detection
        # --------------------------------------------------

        malware = MalwareDetectionService.analyze(
            event
        )

        # --------------------------------------------------
        # Determine whether threat exists
        # --------------------------------------------------

        threat_detected = bool(
            ioc_matches
            or suspicious_login.get(
                "is_suspicious",
                False,
            )
            or brute_force.get(
                "is_brute_force",
                False,
            )
            or malware.get(
                "is_malware",
                False,
            )
        )

        detection_types = []

        if ioc_matches:
            detection_types.append(
                "IOC_MATCH"
            )

        if suspicious_login.get(
            "is_suspicious",
            False,
        ):
            detection_types.append(
                "SUSPICIOUS_LOGIN"
            )

        if brute_force.get(
            "is_brute_force",
            False,
        ):
            detection_types.append(
                "BRUTE_FORCE"
            )

        if malware.get(
            "is_malware",
            False,
        ):
            detection_types.append(
                "MALWARE"
            )

        severity = cls._determine_severity(
            ioc_matches=ioc_matches,
            suspicious_login=suspicious_login,
            brute_force=brute_force,
            malware=malware,
        )

        incident = None

        # --------------------------------------------------
        # Automatic incident creation
        # --------------------------------------------------

        if threat_detected and create_incident:
            try:
                incident = (
                    cls._create_incident(
                        event=event,
                        detection_types=detection_types,
                        severity=severity,
                        ioc_matches=ioc_matches,
                        suspicious_login=(
                            suspicious_login
                        ),
                        brute_force=brute_force,
                        malware=malware,
                    )
                )

            except Exception:
                logger.exception(
                    "Automatic incident creation failed."
                )
                raise

        return {
            "threat_detected": threat_detected,
            "detection_types": detection_types,
            "severity": severity,
            "ioc_matches": cls._serialize_ioc_matches(
                ioc_matches
            ),
            "suspicious_login": suspicious_login,
            "brute_force": brute_force,
            "malware": malware,
            "incident_created": incident is not None,
            "incident_id": (
                incident.incident_id
                if incident
                else None
            ),
        }

    @staticmethod
    def _determine_severity(
        *,
        ioc_matches,
        suspicious_login,
        brute_force,
        malware,
    ):
        """
        Determine final incident severity from detector results.
        """

        severity_rank = {
            IncidentSeverity.LOW: 1,
            IncidentSeverity.MEDIUM: 2,
            IncidentSeverity.HIGH: 3,
            IncidentSeverity.CRITICAL: 4,
        }

        detected_severities = []

        # IOC severity
        for match in ioc_matches:
            ioc = match.get("ioc")

            if (
                ioc
                and ioc.severity
                in severity_rank
            ):
                detected_severities.append(
                    ioc.severity
                )

        # Suspicious login
        login_score = suspicious_login.get(
            "risk_score",
            0,
        )

        if suspicious_login.get(
            "is_suspicious",
            False,
        ):
            if login_score >= 80:
                detected_severities.append(
                    IncidentSeverity.HIGH
                )
            else:
                detected_severities.append(
                    IncidentSeverity.MEDIUM
                )

        # Brute force
        if brute_force.get(
            "is_brute_force",
            False,
        ):
            detected_severities.append(
                IncidentSeverity.HIGH
            )

        # Malware
        malware_score = malware.get(
            "risk_score",
            0,
        )

        if malware.get(
            "is_malware",
            False,
        ):
            if malware_score >= 90:
                detected_severities.append(
                    IncidentSeverity.CRITICAL
                )
            else:
                detected_severities.append(
                    IncidentSeverity.HIGH
                )

        if not detected_severities:
            return IncidentSeverity.LOW

        return max(
            detected_severities,
            key=lambda severity: (
                severity_rank[severity]
            ),
        )

    @classmethod
    def _create_incident(
        cls,
        *,
        event,
        detection_types,
        severity,
        ioc_matches,
        suspicious_login,
        brute_force,
        malware,
    ):
        """
        Build and create an incident from detection results.
        """

        title = (
            "Automated Security Detection: "
            + ", ".join(detection_types)
        )

        description_parts = [
            "Incident automatically generated "
            "by the SOC Detection Engine.",
            "",
            "Detections: "
            + ", ".join(detection_types),
        ]

        source_ip = event.get(
            "ip_address"
        )

        username = event.get(
            "username"
        )

        file_name = event.get(
            "file_name"
        )

        if source_ip:
            description_parts.append(
                f"Source IP: {source_ip}"
            )

        if username:
            description_parts.append(
                f"Username: {username}"
            )

        if file_name:
            description_parts.append(
                f"File: {file_name}"
            )

        if ioc_matches:
            description_parts.append(
                f"IOC matches: "
                f"{len(ioc_matches)}"
            )

        login_reasons = (
            suspicious_login.get(
                "reasons",
                [],
            )
        )

        if login_reasons:
            description_parts.append(
                "Login findings: "
                + "; ".join(login_reasons)
            )

        if brute_force.get(
            "is_brute_force",
            False,
        ):
            description_parts.append(
                "Brute-force activity detected."
            )

        malware_reasons = malware.get(
            "reasons",
            [],
        )

        if malware_reasons:
            description_parts.append(
                "Malware findings: "
                + "; ".join(malware_reasons)
            )

        description = "\n".join(
            description_parts
        )

        return AutoIncidentService.create_incident(
            title=title,
            description=description,
            severity=severity,
        )

    @staticmethod
    def _serialize_ioc_matches(
        matches,
    ):
        """
        Convert IOC model instances into serializable data.
        """

        serialized = []

        for match in matches:
            ioc = match.get("ioc")

            if not ioc:
                continue

            serialized.append(
                {
                    "field": match.get(
                        "field"
                    ),
                    "value": match.get(
                        "value"
                    ),
                    "ioc_type": ioc.ioc_type,
                    "severity": ioc.severity,
                }
            )

        return serialized

    @staticmethod
    def _empty_result():
        """
        Safe response for invalid events.
        """

        return {
            "threat_detected": False,
            "detection_types": [],
            "severity": IncidentSeverity.LOW,
            "ioc_matches": [],
            "suspicious_login": {
                "is_suspicious": False,
                "reasons": [],
                "risk_score": 0,
            },
            "brute_force": {
                "is_brute_force": False,
                "threshold": 5,
                "window_minutes": 10,
                "total_failed_attempts": 0,
                "detections": [],
            },
            "malware": {
                "is_malware": False,
                "risk_score": 0,
                "reasons": [],
                "matched_iocs": [],
            },
            "incident_created": False,
            "incident_id": None,
        }