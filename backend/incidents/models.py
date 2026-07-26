import uuid

from django.conf import settings
from django.db import models
from django.db.models import Max


class IncidentSeverity(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    CRITICAL = "CRITICAL", "Critical"


class IncidentStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    RESOLVED = "RESOLVED", "Resolved"
    CLOSED = "CLOSED", "Closed"


class Incident(models.Model):
    """
    Enterprise Incident Model
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    incident_id = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField()

    severity = models.CharField(
        max_length=20,
        choices=IncidentSeverity.choices,
        default=IncidentSeverity.LOW,
    )

    status = models.CharField(
        max_length=20,
        choices=IncidentStatus.choices,
        default=IncidentStatus.OPEN,
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_incidents",
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_incidents",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "incidents"
        ordering = ["-created_at"]
        verbose_name = "Incident"
        verbose_name_plural = "Incidents"

    def __str__(self):
        return f"{self.incident_id} - {self.title}"

    def save(self, *args, **kwargs):
      if not self.incident_id:

          last_incident = (
              Incident.objects.aggregate(
                  max_id=Max("incident_id")
              )["max_id"]
          )

          if last_incident:
              number = int(last_incident.split("-")[1]) + 1
          else:
              number = 1

          self.incident_id = f"INC-{number:06d}"

      super().save(*args, **kwargs)