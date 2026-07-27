from dashboard.api.views import DashboardAPIView
from django.urls import path

urlpatterns = [
    path(
        "",
        DashboardAPIView.as_view(),
        name="dashboard",
    ),
]