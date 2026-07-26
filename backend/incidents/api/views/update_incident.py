from accounts.api.permissions import IsAdminOrManager
from drf_spectacular.utils import extend_schema
from incidents.api.serializers import (IncidentDetailSerializer,
                                       UpdateIncidentSerializer)
from incidents.selectors import IncidentSelector
from incidents.services import IncidentService
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from incidents.services.cache_service import CacheService

@extend_schema(
    tags=["Incidents"],
    request=UpdateIncidentSerializer,
    responses={200: IncidentDetailSerializer},
)
class UpdateIncidentAPIView(APIView):
    """
    Update an existing incident.
    """

    permission_classes = [
        IsAuthenticated,
        IsAdminOrManager,
    ]

    def put(self, request, pk):
        return self._update(request, pk, partial=False)

    def patch(self, request, pk):
        return self._update(request, pk, partial=True)

    def _update(self, request, pk, partial):
        incident = IncidentSelector.get_by_id(pk)

        if incident is None:
            return Response(
                {"detail": "Incident not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UpdateIncidentSerializer(
            incident,
            data=request.data,
            partial=partial,
        )

        serializer.is_valid(raise_exception=True)

        IncidentService.update_incident(serializer)

        return Response(
            {
                "message": "Incident updated successfully.",
                "data": IncidentDetailSerializer(
                    incident
                ).data,
            },
            status=status.HTTP_200_OK,
        )