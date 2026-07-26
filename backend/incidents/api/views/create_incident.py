from accounts.api.permissions import IsAdminOrManager
from drf_spectacular.utils import extend_schema
from incidents.api.serializers import CreateIncidentSerializer
from incidents.services import IncidentService
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(
    tags=["Incidents"],
    request=CreateIncidentSerializer,
    responses={201: CreateIncidentSerializer},
)
class CreateIncidentAPIView(APIView):
    """
    Create a new Incident.
    """

    permission_classes = [
        IsAuthenticated,
        IsAdminOrManager,
    ]

    def post(self, request):
        serializer = CreateIncidentSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        incident = IncidentService.create_incident(
            serializer
        )

        return Response(
            {
                "message": "Incident created successfully.",
                "incident_id": incident.incident_id,
                "data": CreateIncidentSerializer(
                    incident
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )