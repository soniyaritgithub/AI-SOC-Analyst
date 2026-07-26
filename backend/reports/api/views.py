from django.http import FileResponse
from reports.services.excel_report_service import ExcelReportService
from reports.services.pdf_report_service import PDFReportService
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


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