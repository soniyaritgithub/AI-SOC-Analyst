import logging

from celery import shared_task
from incidents.services.report_service import ReportService
from notifications.services.notification_service import NotificationService

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_incident_notification(
    self,
    incident_id,
):
    """
    Background task for incident notification.
    """

    logger.info(
        "Sending notification for Incident %s",
        incident_id,
    )

    # Email
    NotificationService.send_email(
        subject="Incident Created",
        message=f"Incident {incident_id} created.",
        recipients=["soc@example.com"],
    )

    # WebSocket
    NotificationService.send_websocket_notification(
        {
            "type": "incident_created",
            "severity": "Critical",
            "message": f"Incident {incident_id} created.",
        }
    )

    return {
        "status": "success",
        "incident_id": incident_id,
    }


@shared_task
def daily_incident_summary():
    """
    Generate and send
    daily SOC report.
    """

    report = ReportService.generate_daily_summary()

    NotificationService.send_email(
        subject="Daily Incident Summary",
        message=str(report),
        recipients=[
            "soc@example.com",
        ],
    )

    return report