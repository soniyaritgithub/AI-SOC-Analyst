import logging

from channels.generic.websocket import AsyncJsonWebsocketConsumer

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket consumer for real-time notifications.
    """

    GROUP_NAME = "notifications"

    async def connect(self):
        """
        Handle WebSocket connection.
        """
        logger.info("Notification WebSocket connect started")

        await self.channel_layer.group_add(
            self.GROUP_NAME,
            self.channel_name,
        )

        logger.info("Added to group: %s", self.GROUP_NAME)

        await self.accept()

        logger.info("Notification WebSocket accepted")

        await self.send_json(
            {
                "type": "connection",
                "message": "Connected successfully.",
            }
        )

    async def disconnect(self, close_code):
        """
        Handle WebSocket disconnect.
        """

        await self.channel_layer.group_discard(
            self.GROUP_NAME,
            self.channel_name,
        )

        logger.info(
            "Disconnected from group: %s",
            self.GROUP_NAME,
        )

    async def receive_json(
        self,
        content,
        **kwargs,
    ):
        """
        Receive JSON message.
        """
        pass

    async def notification(
        self,
        event,
    ):
        """
        Send notification to client.
        """

        logger.info(
            "Notification received: %s",
            event,
        )

        await self.send_json(
            event["data"]
        )


class DashboardConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket consumer for real-time dashboard updates.
    """

    GROUP_NAME = "dashboard"

    async def connect(self):
        """
        Handle dashboard WebSocket connection.
        """

        logger.info("Dashboard WebSocket connect started")

        await self.channel_layer.group_add(
            self.GROUP_NAME,
            self.channel_name,
        )

        logger.info(
            "Added to dashboard group: %s",
            self.GROUP_NAME,
        )

        await self.accept()

        logger.info("Dashboard WebSocket accepted")

        await self.send_json(
            {
                "type": "connection",
                "message": "Dashboard WebSocket connected successfully.",
            }
        )

    async def disconnect(self, close_code):
        """
        Handle dashboard WebSocket disconnect.
        """

        await self.channel_layer.group_discard(
            self.GROUP_NAME,
            self.channel_name,
        )

        logger.info(
            "Disconnected from dashboard group: %s",
            self.GROUP_NAME,
        )

    async def receive_json(
        self,
        content,
        **kwargs,
    ):
        """
        Receive JSON message from dashboard client.
        """

        pass

    async def dashboard_update(
        self,
        event,
    ):
        """
        Send latest dashboard data to client.
        """

        logger.info(
            "Dashboard update received: %s",
            event,
        )

        await self.send_json(
            {
                "type": "dashboard_update",
                "data": event["data"],
            }
        )