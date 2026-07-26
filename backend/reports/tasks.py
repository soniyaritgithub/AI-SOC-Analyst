import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMessage
from django.utils import timezone
from reports.services.monthly_report_service import MonthlyReportService
from reports.services.pdf_report_service import PDFReportService

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_scheduled_incident_report(self, recipient_email):
    """
    Generate the current incident PDF report
    and send it to the specified email address.
    """

    if not recipient_email:
        raise ValueError(
            "Recipient email is required."
        )

    logger.info(
        "Generating scheduled incident report for %s",
        recipient_email,
    )

    pdf_buffer = (
        PDFReportService.generate_incident_report()
    )

    generated_at = timezone.localtime()

    filename = (
        "soc_incident_report_"
        f"{generated_at.strftime('%Y_%m_%d')}.pdf"
    )

    subject = (
        "AI SOC Analyst - Scheduled Incident Report"
    )

    body = (
        "Hello,\n\n"
        "Your scheduled AI SOC Analyst incident "
        "report is attached.\n\n"
        f"Generated at: "
        f"{generated_at.strftime('%d %B %Y %H:%M:%S')}\n\n"
        "Regards,\n"
        "AI SOC Analyst"
    )

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient_email],
    )

    email.attach(
        filename,
        pdf_buffer.getvalue(),
        "application/pdf",
    )

    sent_count = email.send(
        fail_silently=False
    )

    logger.info(
        "Scheduled incident report sent to %s",
        recipient_email,
    )

    return {
        "success": sent_count == 1,
        "recipient": recipient_email,
        "filename": filename,
    }
@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_monthly_incident_report(
    self,
    recipient_email,
):
    """
    Generate and email the previous month's
    PDF and Excel incident reports.
    """

    if not recipient_email:
        raise ValueError(
            "Recipient email is required."
        )

    start, end = (
        MonthlyReportService
        .get_previous_month_range()
    )

    logger.info(
        "Generating monthly report for "
        "%s to %s",
        start,
        end,
    )

    pdf_buffer = (
        MonthlyReportService.generate_pdf(
            start,
            end,
        )
    )

    excel_buffer = (
        MonthlyReportService.generate_excel(
            start,
            end,
        )
    )

    month_name = start.strftime(
        "%B_%Y"
    )

    pdf_filename = (
        f"soc_monthly_report_{month_name}.pdf"
    )

    excel_filename = (
        f"soc_monthly_report_{month_name}.xlsx"
    )

    subject = (
        "AI SOC Analyst - Monthly Incident Report "
        f"- {start.strftime('%B %Y')}"
    )

    body = (
        "Hello,\n\n"
        "Your monthly AI SOC Analyst incident "
        "report is attached.\n\n"
        f"Reporting period: "
        f"{start.strftime('%d %B %Y')} - "
        f"{end.strftime('%d %B %Y')}\n\n"
        "Attachments:\n"
        "- PDF incident report\n"
        "- Excel incident report\n\n"
        "Regards,\n"
        "AI SOC Analyst"
    )

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient_email],
    )

    email.attach(
        pdf_filename,
        pdf_buffer.getvalue(),
        "application/pdf",
    )

    email.attach(
        excel_filename,
        excel_buffer.getvalue(),
        (
            "application/vnd.openxmlformats-"
            "officedocument.spreadsheetml.sheet"
        ),
    )

    sent_count = email.send(
        fail_silently=False
    )

    logger.info(
        "Monthly incident report sent to %s",
        recipient_email,
    )

    return {
        "success": sent_count == 1,
        "recipient": recipient_email,
        "period": start.strftime("%Y-%m"),
        "pdf_filename": pdf_filename,
        "excel_filename": excel_filename,
    }