from accounts.api.permissions import IsAdminOrManager
from audit_logs.api.serializers import (AuditLogDashboardSerializer,
                                        AuditLogSerializer,
                                        AuditLogStatisticsSerializer)
from audit_logs.filters import AuditLogFilter
from audit_logs.selectors import AuditLogSelector
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
from rest_framework.response import Response


class AuditLogListAPIView(generics.ListAPIView):
    """
    API for listing audit logs.
    """

    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminOrManager]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "description",
        "action",
        "user__full_name",
        "incident__incident_id",
    ]

    filterset_class = AuditLogFilter

    ordering_fields = [
        "created_at",
        "action",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):
        return AuditLogSelector.get_all()

class AuditLogDetailAPIView(generics.RetrieveAPIView):
    """
    API for retrieving a single audit log.
    """

    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminOrManager]

    def get_object(self):
        return get_object_or_404(
            AuditLogSelector.get_all(),
            id=self.kwargs["id"],
        )

class AuditLogStatisticsAPIView(generics.GenericAPIView):
    """
    API for Audit Log Statistics.
    """

    permission_classes = [IsAdminOrManager]
    serializer_class = AuditLogStatisticsSerializer

    def get(self, request):
        statistics = AuditLogSelector.get_statistics()

        serializer = self.get_serializer(statistics)

        return Response(serializer.data)

class AuditLogDashboardAPIView(generics.GenericAPIView):
    """
    API for Audit Log Dashboard.
    """

    permission_classes = [IsAdminOrManager]
    serializer_class = AuditLogDashboardSerializer

    def get(self, request):
        data = {
            "statistics": AuditLogSelector.get_statistics(),
            "recent_logs": AuditLogSelector.get_recent_logs(),
        }

        serializer = self.get_serializer(data)

        return Response(serializer.data)