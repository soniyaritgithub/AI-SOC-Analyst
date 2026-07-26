from django.urls import path
from reports.api.views import (IncidentExcelReportAPIView,
                               IncidentPDFReportAPIView)

app_name = "reports"


urlpatterns = [
    path(
        "incidents/pdf/",
        IncidentPDFReportAPIView.as_view(),
        name="incident-pdf-report",
    ),

    path(
        "incidents/excel/",
        IncidentExcelReportAPIView.as_view(),
        name="incident-excel-report",
    ),
]