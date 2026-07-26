from accounts.api.permissions import IsAdmin
from drf_spectacular.utils import extend_schema
from incidents.selectors import IncidentSelector
from incidents.services import IncidentService
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(
    tags=["Incidents"],
    responses={204: None},
)
class DeleteIncidentAPIView(APIView):
    """
    Delete an incident.
    """

    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def delete(self, request, pk):
        incident = IncidentSelector.get_by_id(pk)

        if incident is None:
            return Response(
                {
                    "detail": "Incident not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        IncidentService.delete_incident(
            incident
        )

        return Response(
            {
                "message": "Incident deleted successfully."
            },
            status=status.HTTP_200_OK,
        )