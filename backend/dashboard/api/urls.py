from dashboard.api.views import DashboardAPIView
from django.urls import path

urlpatterns = [
    path(
        "threat-feed/",
        DashboardAPIView.as_view(),
        name="dashboard-threat-feed",
    ),
]