import uuid

from django.conf import settings
from django.db import models
from incidents.models import Incident


class AuditAction(models.TextChoices):
    CREATED = "CREATED", "Created"
    UPDATED = "UPDATED", "Updated"
    ASSIGNED = "ASSIGNED", "Assigned"
    STATUS_CHANGED = "STATUS_CHANGED", "Status Changed"
    DELETED = "DELETED", "Deleted"


class AuditLog(models.Model):
    """
    Stores audit logs for incident-related actions.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="audit_logs",
    )

    incident = models.ForeignKey(
        Incident,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )

    action = models.CharField(
        max_length=30,
        choices=AuditAction.choices,
    )

    description = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "audit_logs"
        ordering = ["-created_at"]
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"

    def __str__(self):
        incident = (
            self.incident.incident_id
            if self.incident
            else "No Incident"
        )

        return f"{self.action} - {incident}"