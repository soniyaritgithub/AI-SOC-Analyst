from accounts.api.permissions import IsSOCMember
from drf_spectacular.utils import extend_schema
from incidents.api.serializers import IncidentDetailSerializer
from incidents.selectors import IncidentSelector
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(
    tags=["Incidents"],
    responses={200: IncidentDetailSerializer},
)
class IncidentDetailAPIView(APIView):
    """
    Retrieve Incident Details.
    """

    permission_classes = [
        IsSOCMember,
    ]

    def get(self, request, pk):
        incident = IncidentSelector.get_by_id(pk)

        if incident is None:
            return Response(
                {
                    "detail": "Incident not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = IncidentDetailSerializer(
            incident
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )