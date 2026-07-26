from datetime import datetime

from accounts.api.permissions import IsAdminOrManager
from django.http import HttpResponse
from drf_spectacular.utils import (OpenApiExample, OpenApiParameter,
                                   OpenApiResponse, extend_schema)
from incidents.api.serializers import (DashboardFilterSerializer,
                                       IncidentAnalystSerializer,
                                       IncidentDashboardSerializer,
                                       IncidentSeveritySerializer,
                                       IncidentStatisticsSerializer,
                                       IncidentStatusSerializer,
                                       IncidentTrendSerializer)
from incidents.selectors import IncidentSelector
from incidents.services.csv_export import CSVExportService
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(
    summary="Incident Statistics",
    description="Returns overall incident statistics for the SOC Dashboard.",
    responses={
        200: OpenApiResponse(
            response=IncidentStatisticsSerializer,
            description="Incident statistics retrieved successfully.",
        ),
    },
    examples=[
        OpenApiExample(
            "Success",
            value={
                "total_incidents": 25,
                "open": 8,
                "in_progress": 6,
                "resolved": 9,
                "closed": 2,
            },
            response_only=True,
        ),
    ],
)
class IncidentStatisticsAPIView(generics.GenericAPIView):
    serializer_class = IncidentStatisticsSerializer
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        statistics = IncidentSelector.get_statistics()

        serializer = self.get_serializer(statistics)

        return Response(serializer.data)


@extend_schema(
    summary="Incident Severity Distribution",
    description=(
        "Returns the distribution of incidents grouped by severity "
        "for the SOC Dashboard."
    ),
    responses={
        200: OpenApiResponse(
            response=IncidentSeveritySerializer(many=True),
            description="Incident severity distribution retrieved successfully.",
        ),
    },
    examples=[
        OpenApiExample(
            "Success",
            value=[
                {
                    "severity": "CRITICAL",
                    "count": 5,
                },
                {
                    "severity": "HIGH",
                    "count": 8,
                },
                {
                    "severity": "MEDIUM",
                    "count": 12,
                },
                {
                    "severity": "LOW",
                    "count": 3,
                },
            ],
            response_only=True,
        ),
    ],
)
class IncidentSeverityAPIView(generics.GenericAPIView):
    """
    Incident Severity Distribution API.
    """

    serializer_class = IncidentSeveritySerializer

    permission_classes = [
        IsAdminOrManager,
    ]

    def get(self, request):
        data = IncidentSelector.get_severity_distribution()

        serializer = self.get_serializer(
            data,
            many=True,
        )

        return Response(serializer.data)


@extend_schema(
    summary="Incident Status Distribution",
    description=(
        "Returns the distribution of incidents grouped by status "
        "for the SOC Dashboard."
    ),
    responses={
        200: OpenApiResponse(
            response=IncidentStatusSerializer(many=True),
            description="Incident status distribution retrieved successfully.",
        ),
    },
    examples=[
        OpenApiExample(
            "Success",
            value=[
                {
                    "status": "OPEN",
                    "count": 10,
                },
                {
                    "status": "IN_PROGRESS",
                    "count": 7,
                },
                {
                    "status": "RESOLVED",
                    "count": 15,
                },
                {
                    "status": "CLOSED",
                    "count": 5,
                },
            ],
            response_only=True,
        ),
    ],
)
class IncidentStatusAPIView(generics.GenericAPIView):
    """
    Incident Status Distribution API.
    """

    serializer_class = IncidentStatusSerializer

    permission_classes = [
        IsAdminOrManager,
    ]

    def get(self, request):
        data = IncidentSelector.get_status_distribution()

        serializer = self.get_serializer(
            data,
            many=True,
        )

        return Response(serializer.data)


@extend_schema(
    summary="Incident Analyst Performance",
    description=(
        "Returns incident counts assigned to each analyst "
        "for the SOC Dashboard."
    ),
    responses={
        200: OpenApiResponse(
            response=IncidentAnalystSerializer(many=True),
            description="Analyst performance retrieved successfully.",
        ),
    },
    examples=[
        OpenApiExample(
            "Success",
            value=[
                {
                    "analyst": "John Doe",
                    "total_incidents": 18,
                },
                {
                    "analyst": "Alice Smith",
                    "total_incidents": 12,
                },
                {
                    "analyst": "David Johnson",
                    "total_incidents": 7,
                },
            ],
            response_only=True,
        ),
    ],
)
class IncidentAnalystAPIView(generics.GenericAPIView):
    """
    Analyst Performance API.
    """

    serializer_class = IncidentAnalystSerializer

    permission_classes = [
        IsAdminOrManager,
    ]

    def get(self, request):
        data = IncidentSelector.get_analyst_performance()

        serializer = self.get_serializer(
            data,
            many=True,
        )

        return Response(serializer.data)


@extend_schema(
    summary="Monthly Incident Trends",
    description=(
        "Returns the monthly trend of incidents for the "
        "SOC Dashboard."
    ),
    responses={
        200: OpenApiResponse(
            response=IncidentTrendSerializer(many=True),
            description="Monthly incident trends retrieved successfully.",
        ),
    },
    examples=[
        OpenApiExample(
            "Success",
            value=[
                {
                    "month": "Jan 2026",
                    "count": 18,
                },
                {
                    "month": "Feb 2026",
                    "count": 24,
                },
                {
                    "month": "Mar 2026",
                    "count": 16,
                },
                {
                    "month": "Apr 2026",
                    "count": 30,
                },
            ],
            response_only=True,
        ),
    ],
)
class IncidentTrendAPIView(generics.GenericAPIView):
    """
    Monthly Incident Trend API.
    """

    serializer_class = IncidentTrendSerializer

    permission_classes = [
        IsAdminOrManager,
    ]

    def get(self, request):
        trends = IncidentSelector.get_monthly_trends()

        serializer = self.get_serializer(
            trends,
            many=True,
        )

        return Response(serializer.data)


@extend_schema(
    summary="SOC Dashboard Analytics",
    parameters=[
        OpenApiParameter(
            name="severity",
            description="Filter by severity.",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="status",
            description="Filter by status.",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="assigned_to",
            description="Filter by assigned user ID.",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="start_date",
            description="Start date (YYYY-MM-DD).",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="end_date",
            description="End date (YYYY-MM-DD).",
            required=False,
            type=str,
        ),
    ],
    description=(
        "Returns complete analytics data required for the SOC Dashboard, "
        "including incident statistics, severity distribution, status "
        "distribution, analyst performance, monthly trends, and recent incidents."
    ),
    responses={
        200: OpenApiResponse(
            response=IncidentDashboardSerializer,
            description="Dashboard analytics retrieved successfully.",
        ),
    },
    examples=[
        OpenApiExample(
            "Success",
            value={
                "statistics": {
                    "total_incidents": 50,
                    "open": 12,
                    "in_progress": 8,
                    "resolved": 25,
                    "closed": 5,
                },
                "severity_distribution": [
                    {
                        "severity": "CRITICAL",
                        "count": 6,
                    },
                    {
                        "severity": "HIGH",
                        "count": 14,
                    },
                ],
                "status_distribution": [
                    {
                        "status": "OPEN",
                        "count": 12,
                    },
                    {
                        "status": "RESOLVED",
                        "count": 25,
                    },
                ],
                "analyst_performance": [
                    {
                        "analyst": "John Doe",
                        "total_incidents": 18,
                    },
                    {
                        "analyst": "Alice Smith",
                        "total_incidents": 15,
                    },
                ],
                "monthly_trends": [
                    {
                        "month": "Jan 2026",
                        "count": 20,
                    },
                    {
                        "month": "Feb 2026",
                        "count": 30,
                    },
                ],
                "recent_incidents": [
                    {
                        "id": 101,
                        "title": "Suspicious Login Attempt",
                    },
                    {
                        "id": 102,
                        "title": "Malware Detected",
                    },
                ],
            },
            response_only=True,
        ),
    ],
)
class IncidentDashboardAPIView(generics.GenericAPIView):
    """
    Incident Dashboard API.
    """

    serializer_class = IncidentDashboardSerializer

    permission_classes = [
        IsAdminOrManager,
    ]

    def get(self, request):
        filter_serializer = DashboardFilterSerializer(
            data=request.query_params,
        )

        filter_serializer.is_valid(
            raise_exception=True,
        )

        queryset = IncidentSelector.get_filtered_queryset(
            filter_serializer.validated_data,
        )

        dashboard = {
            "statistics": IncidentSelector.get_statistics(queryset),
            "severity_distribution": IncidentSelector.get_severity_distribution(queryset),
            "status_distribution": IncidentSelector.get_status_distribution(queryset),
            "analyst_performance": IncidentSelector.get_analyst_performance(queryset),
            "monthly_trends": IncidentSelector.get_monthly_trends(queryset),
            "recent_incidents": (
                queryset
                .select_related(
                    "assigned_to",
                    "created_by",
                )
                .only(
                    "id",
                    "incident_id",
                    "title",
                    "severity",
                    "status",
                    "created_at",
                    "assigned_to__full_name",
                    "created_by__full_name",
                )
                .order_by("-created_at")[:10]
            ),
        }

        serializer = self.get_serializer(dashboard)

        return Response(serializer.data)


@extend_schema(
    summary="Export SOC Dashboard CSV",
    description="Exports filtered SOC dashboard incident data as a CSV file.",
    parameters=[
        OpenApiParameter(
            name="severity",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="status",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="assigned_to",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="start_date",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="end_date",
            required=False,
            type=str,
        ),
    ],
    responses={
        (200, "text/csv"): OpenApiResponse(
            response=bytes,
            description="Dashboard CSV export.",
        ),
    },
)
class DashboardExportAPIView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        filter_serializer = DashboardFilterSerializer(
            data=request.query_params,
        )
        filter_serializer.is_valid(
            raise_exception=True,
        )

        queryset = IncidentSelector.get_filtered_queryset(
            filter_serializer.validated_data,
        )

        csv_content = CSVExportService.export_dashboard(
            queryset=queryset,
        )

        response = HttpResponse(
            csv_content,
            content_type="text/csv",
        )

        filename = (
            f"dashboard_{datetime.now():%Y_%m_%d}.csv"
        )

        response[
            "Content-Disposition"
        ] = (
            f'attachment; filename="{filename}"'
        )

        return response