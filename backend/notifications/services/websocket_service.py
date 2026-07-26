from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class WebSocketService:
    """
    Central service for broadcasting real-time WebSocket events.
    """

    NOTIFICATION_GROUP = "notifications"
    DASHBOARD_GROUP = "dashboard"

    @classmethod
    def send_notification(cls, data):
        """
        Broadcast a notification event to connected notification clients.
        """

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            cls.NOTIFICATION_GROUP,
            {
                "type": "notification",
                "data": data,
            },
        )

    @classmethod
    def send_dashboard_update(cls, data):
        """
        Broadcast updated dashboard data to connected dashboard clients.
        """

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            cls.DASHBOARD_GROUP,
            {
                "type": "dashboard_update",
                "data": data,
            },
        )