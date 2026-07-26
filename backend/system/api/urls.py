from django.urls import path
from system.api.views import SystemHealthAPIView

app_name = "system"

urlpatterns = [
    path(
        "health/",
        SystemHealthAPIView.as_view(),
        name="health",
    ),
]