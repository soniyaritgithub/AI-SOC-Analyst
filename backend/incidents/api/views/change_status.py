from accounts.api.permissions import IsSOCMember
from drf_spectacular.utils import extend_schema
from incidents.api.serializers import (ChangeIncidentStatusSerializer,
                                       IncidentDetailSerializer)
from incidents.selectors import IncidentSelector
from incidents.services import IncidentService
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(
    tags=["Incidents"],
    request=ChangeIncidentStatusSerializer,
    responses={200: IncidentDetailSerializer},
)
class ChangeIncidentStatusAPIView(APIView):
    """
    Change Incident Status.
    """

    permission_classes = [
        IsSOCMember,
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

        serializer = ChangeIncidentStatusSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        IncidentService.change_status(
            incident=incident,
            status=serializer.validated_data[
                "status"
            ],
        )

        return Response(
            {
                "message":
                    "Incident status updated successfully.",
                "data": IncidentDetailSerializer(
                    incident
                ).data,
            },
            status=status.HTTP_200_OK,
        )