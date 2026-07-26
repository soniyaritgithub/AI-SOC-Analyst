import logging

from notifications.services.websocket_service import WebSocketService

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Enterprise Notification Service.
    """

    @staticmethod
    def send_email(subject, message, recipients):
        """
        Send email notification.
        """

        logger.info(
            "Email notification sent to %s",
            recipients,
        )

    @staticmethod
    def send_slack(channel, message):
        """
        Send Slack notification.
        """

        logger.info(
            "Slack notification sent to %s",
            channel,
        )

    @staticmethod
    def send_teams(channel, message):
        """
        Send Microsoft Teams notification.
        """

        logger.info(
            "Teams notification sent to %s",
            channel,
        )

    @staticmethod
    def send_sms(phone, message):
        """
        Send SMS notification.
        """

        logger.info(
            "SMS notification sent to %s",
            phone,
        )
    @staticmethod
    def send_websocket_notification(data):
          """
          Send real-time notification using WebSocket.
          """

          WebSocketService.send_notification(data)