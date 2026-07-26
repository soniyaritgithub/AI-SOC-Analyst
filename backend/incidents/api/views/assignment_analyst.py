from accounts.api.permissions import IsAdminOrManager
from accounts.models import UserRole
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from incidents.api.serializers import AssignmentAnalystSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

User = get_user_model()


@extend_schema(
    tags=["Incidents"],
    summary="Available SOC Analysts",
    description=(
        "Returns active SOC Analysts available "
        "for incident assignment."
    ),
    responses={
        200: AssignmentAnalystSerializer(many=True),
    },
)
class AssignmentAnalystListAPIView(APIView):
    """
    List active SOC Analysts available for assignment.
    """

    permission_classes = [
        IsAdminOrManager,
    ]

    def get(self, request):
        analysts = (
            User.objects.filter(
                role=UserRole.SOC_ANALYST,
                is_active=True,
            )
            .only(
                "id",
                "full_name",
                "email",
            )
            .order_by("full_name", "email")
        )

        serializer = AssignmentAnalystSerializer(
            analysts,
            many=True,
        )

        return Response(serializer.data)