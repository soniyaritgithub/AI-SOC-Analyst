from django.urls import path
from incidents.api.views import (AssignIncidentAPIView,
                                 AssignmentAnalystListAPIView,
                                 ChangeIncidentStatusAPIView,
                                 CreateIncidentAPIView, DeleteIncidentAPIView,
                                 IncidentAnalystAPIView,
                                 IncidentDashboardAPIView,
                                 IncidentDetailAPIView, IncidentListAPIView,
                                 IncidentSeverityAPIView,
                                 IncidentStatisticsAPIView,
                                 IncidentStatusAPIView, IncidentTrendAPIView,
                                 UpdateIncidentAPIView)
from incidents.api.views.incident import DashboardExportAPIView

urlpatterns = [
    path(
        "",
        IncidentListAPIView.as_view(),
        name="incident-list",
    ),

    path(
        "create/",
        CreateIncidentAPIView.as_view(),
        name="incident-create",
    ),

    path(
        "<uuid:pk>/",
        IncidentDetailAPIView.as_view(),
        name="incident-detail",
    ),

    path(
        "<uuid:pk>/update/",
        UpdateIncidentAPIView.as_view(),
        name="incident-update",
    ),

    path(
        "<uuid:pk>/delete/",
        DeleteIncidentAPIView.as_view(),
        name="incident-delete",
    ),
    path(
    "<uuid:pk>/assign/",
    AssignIncidentAPIView.as_view(),
    name="incident-assign",
    ),
    path(
    "<uuid:pk>/status/",
    ChangeIncidentStatusAPIView.as_view(),
    name="incident-status",
    ),
    path(
    "stats/",
    IncidentStatisticsAPIView.as_view(),
    name="incident-statistics",
    ),
    path(
    "severity/",
    IncidentSeverityAPIView.as_view(),
    name="incident-severity",
    ),
    path(
    "status/",
    IncidentStatusAPIView.as_view(),
    name="incident-status-distribution",
    ),
    path(
    "analysts/",
    IncidentAnalystAPIView.as_view(),
    name="incident-analyst-performance",
    ),
    path(
    "trends/",
    IncidentTrendAPIView.as_view(),
    name="incident-trends",
    ),
    path(
    "dashboard/",
    IncidentDashboardAPIView.as_view(),
    name="incident-dashboard",
    ),
    path(
    "dashboard/export/csv/",
    DashboardExportAPIView.as_view(),
    name="dashboard-export-csv",
    ),
    path(
    "assignment-analysts/",
    AssignmentAnalystListAPIView.as_view(),
    name="assignment-analyst-list",
    ),

]