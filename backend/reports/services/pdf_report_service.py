from io import BytesIO

from django.utils import timezone
from incidents.models import Incident
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (Paragraph, SimpleDocTemplate, Spacer, Table,
                                TableStyle)


class PDFReportService:
    """
    Generate SOC incident reports in PDF format.
    """

    @staticmethod
    def generate_incident_report():
        """
        Generate a PDF containing current incident data.
        """

        buffer = BytesIO()

        document = SimpleDocTemplate(
            buffer,
            pagesize=landscape(A4),
            rightMargin=15 * mm,
            leftMargin=15 * mm,
            topMargin=15 * mm,
            bottomMargin=15 * mm,
            title="AI SOC Analyst Incident Report",
            author="AI SOC Analyst",
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "ReportTitle",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontSize=20,
            spaceAfter=15,
        )

        story = []

        story.append(
            Paragraph(
                "AI SOC Analyst — Incident Report",
                title_style,
            )
        )

        generated_at = timezone.localtime()

        story.append(
            Paragraph(
                (
                    "Generated: "
                    f"{generated_at.strftime('%d %B %Y %H:%M:%S')}"
                ),
                styles["Normal"],
            )
        )

        story.append(
            Spacer(1, 10 * mm)
        )

        incidents = (
            Incident.objects
            .select_related(
                "assigned_to",
                "created_by",
            )
            .order_by("-created_at")
        )

        story.append(
            Paragraph(
                f"Total Incidents: {incidents.count()}",
                styles["Heading2"],
            )
        )

        story.append(
            Spacer(1, 5 * mm)
        )

        table_data = [
            [
                "Incident ID",
                "Title",
                "Severity",
                "Status",
                "Assigned To",
                "Created At",
            ]
        ]

        for incident in incidents:
            assigned_to = "-"

            if incident.assigned_to:
                assigned_to = str(
                    incident.assigned_to
                )

            table_data.append(
                [
                    incident.incident_id,
                    Paragraph(
                        incident.title,
                        styles["BodyText"],
                    ),
                    incident.severity,
                    incident.status,
                    assigned_to,
                    timezone.localtime(
                        incident.created_at
                    ).strftime(
                        "%d-%m-%Y %H:%M"
                    ),
                ]
            )

        table = Table(
            table_data,
            repeatRows=1,
            colWidths=[
                30 * mm,
                65 * mm,
                25 * mm,
                30 * mm,
                45 * mm,
                40 * mm,
            ],
        )

        table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.lightgrey,
                    ),
                    (
                        "TEXTCOLOR",
                        (0, 0),
                        (-1, 0),
                        colors.black,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        "Helvetica-Bold",
                    ),
                    (
                        "ALIGN",
                        (0, 0),
                        (-1, 0),
                        "CENTER",
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.grey,
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                ]
            )
        )

        story.append(table)

        document.build(story)

        buffer.seek(0)

        return buffer