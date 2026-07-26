from audit_logs.api.views import (AuditLogDashboardAPIView,
                                  AuditLogDetailAPIView, AuditLogListAPIView,
                                  AuditLogStatisticsAPIView)
from django.urls import path

urlpatterns = [
    path(
        "",
        AuditLogListAPIView.as_view(),
        name="audit-log-list",
    ),

    path(
        "stats/",
        AuditLogStatisticsAPIView.as_view(),
        name="audit-log-statistics",
    ),

    path(
        "<uuid:id>/",
        AuditLogDetailAPIView.as_view(),
        name="audit-log-detail",
    ),
     path(
        "dashboard/",
        AuditLogDashboardAPIView.as_view(),
        name="audit-log-dashboard",
    ),
]