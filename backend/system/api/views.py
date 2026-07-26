from drf_spectacular.utils import (OpenApiExample, OpenApiResponse,
                                   extend_schema)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from system.api.serializers import HealthSerializer
from system.services.health_service import HealthService


@extend_schema(
    tags=["System"],
    summary="System Health Check",
    description=(
        "Returns the health status of the system, "
        "including Database, Redis, Cache and "
        "overall response time."
    ),
    responses={
        200: OpenApiResponse(
            response=HealthSerializer,
            description="System health retrieved successfully.",
        ),
    },
    examples=[
        OpenApiExample(
            "Healthy",
            value={
                "status": "healthy",
                "database": {
                    "status": "healthy",
                    "message": "Database connection successful.",
                },
                "redis": {
                    "status": "healthy",
                    "message": "Redis connection successful.",
                },
                "cache": {
                    "status": "healthy",
                    "message": "Cache is working properly.",
                },
                "response_time_ms": 4.75,
            },
            response_only=True,
        ),
    ],
)
class SystemHealthAPIView(APIView):
    """
    System Health Check API.
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        health = HealthService.check_system()

        serializer = HealthSerializer(health)

        return Response(serializer.data)