from django.http import FileResponse
from drf_spectacular.utils import OpenApiResponse, extend_schema
from reports.services.excel_report_service import ExcelReportService
from reports.services.pdf_report_service import PDFReportService
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


@extend_schema(
    summary="Download Incident PDF Report",
    description="Downloads the SOC incident report as a PDF file.",
    responses={
        (200, "application/pdf"): OpenApiResponse(
            response=bytes,
            description="SOC incident PDF report.",
        ),
    },
)
class IncidentPDFReportAPIView(APIView):
    """
    Download incident report as PDF.
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        pdf_buffer = (
            PDFReportService.generate_incident_report()
        )

        return FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename="soc_incident_report.pdf",
            content_type="application/pdf",
        )


@extend_schema(
    summary="Download Incident Excel Report",
    description="Downloads the SOC incident report as an Excel file.",
    responses={
        (
            200,
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet",
        ): OpenApiResponse(
            response=bytes,
            description="SOC incident Excel report.",
        ),
    },
)
class IncidentExcelReportAPIView(APIView):
    """
    Download incident report as Excel.
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        excel_buffer = (
            ExcelReportService.generate_incident_report()
        )

        return FileResponse(
            excel_buffer,
            as_attachment=True,
            filename="soc_incident_report.xlsx",
            content_type=(
                "application/vnd.openxmlformats-"
                "officedocument.spreadsheetml.sheet"
            ),
        )