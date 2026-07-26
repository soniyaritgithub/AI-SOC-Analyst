import uuid

from django.db import models
from incidents.models import IncidentSeverity


class DetectionRuleType(models.TextChoices):
    IOC = "IOC", "IOC Match"
    SUSPICIOUS_LOGIN = "SUSPICIOUS_LOGIN", "Suspicious Login"
    BRUTE_FORCE = "BRUTE_FORCE", "Brute Force"
    MALWARE = "MALWARE", "Malware"


class DetectionRule(models.Model):
    """
    Configurable security detection rule.

    Rules define what the detection engine should look for
    when processing security events.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=255,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    rule_type = models.CharField(
        max_length=30,
        choices=DetectionRuleType.choices,
    )

    severity = models.CharField(
        max_length=20,
        choices=IncidentSeverity.choices,
        default=IncidentSeverity.MEDIUM,
    )

    pattern = models.CharField(
        max_length=500,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "detection_rules"
        ordering = ["-created_at"]
        verbose_name = "Detection Rule"
        verbose_name_plural = "Detection Rules"

    def __str__(self):
        return f"{self.name} ({self.rule_type})"
class IOCType(models.TextChoices):
    """
    Supported Indicator of Compromise types.
    """

    IP_ADDRESS = "IP_ADDRESS", "IP Address"
    DOMAIN = "DOMAIN", "Domain"
    URL = "URL", "URL"
    FILE_HASH = "FILE_HASH", "File Hash"


class IOC(models.Model):
    """
    Indicator of Compromise.

    Stores known malicious indicators that can be matched
    against incoming security events.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    value = models.CharField(
        max_length=500,
        db_index=True,
    )

    ioc_type = models.CharField(
        max_length=20,
        choices=IOCType.choices,
        db_index=True,
    )

    severity = models.CharField(
        max_length=20,
        choices=IncidentSeverity.choices,
        default=IncidentSeverity.HIGH,
    )

    description = models.TextField(
        blank=True,
    )

    source = models.CharField(
        max_length=255,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "indicators_of_compromise"
        ordering = ["-created_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["ioc_type", "value"],
                name="unique_ioc_type_value",
            ),
        ]

        verbose_name = "Indicator of Compromise"
        verbose_name_plural = "Indicators of Compromise"

    def __str__(self):
        return f"{self.ioc_type}: {self.value}"