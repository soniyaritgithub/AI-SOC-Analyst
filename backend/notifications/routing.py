from django.urls import path
from notifications.consumers import DashboardConsumer, NotificationConsumer

websocket_urlpatterns = [
    path(
        "ws/notifications/",
        NotificationConsumer.as_asgi(),
    ),
    path(
        "ws/dashboard/",
        DashboardConsumer.as_asgi(),
    ),
]