from accounts.api.permissions import IsSOCMember
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from incidents.api.filters import IncidentFilter
from incidents.api.pagination import IncidentPagination
from incidents.api.serializers import IncidentListSerializer
from incidents.selectors import IncidentSelector
from rest_framework import filters
from rest_framework.generics import ListAPIView


@extend_schema(tags=["Incidents"])
class IncidentListAPIView(ListAPIView):
    """
    Enterprise Incident List API.
    """

    serializer_class = IncidentListSerializer

    permission_classes = [
        IsSOCMember,
    ]

    pagination_class = IncidentPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = IncidentFilter

    search_fields = [
        "title",
        "incident_id",
    ]

    ordering_fields = [
        "created_at",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):
        return IncidentSelector.get_all()