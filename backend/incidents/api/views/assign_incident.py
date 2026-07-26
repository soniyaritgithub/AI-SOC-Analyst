from accounts.api.permissions import IsAdminOrManager
from drf_spectacular.utils import extend_schema
from incidents.api.serializers import (AssignIncidentSerializer,
                                       IncidentDetailSerializer)
from incidents.selectors import IncidentSelector
from incidents.services import IncidentService
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(
    tags=["Incidents"],
    request=AssignIncidentSerializer,
    responses={200: IncidentDetailSerializer},
)
class AssignIncidentAPIView(APIView):
    """
    Assign an incident to a SOC Analyst.
    """

    permission_classes = [
        IsAuthenticated,
        IsAdminOrManager,
    ]

    def patch(self, request, pk):
        incident = IncidentSelector.get_by_id(pk)

        if incident is None:
            return Response(
                {
                    "detail": "Incident not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AssignIncidentSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        IncidentService.assign_incident(
            incident=incident,
            assigned_to=serializer.validated_data["assigned_to"],
        )

        return Response(
            {
                "message": "Incident assigned successfully.",
                "data": IncidentDetailSerializer(
                    incident
                ).data,
            },
            status=status.HTTP_200_OK,
        )