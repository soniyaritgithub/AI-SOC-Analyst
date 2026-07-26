from accounts.api.permissions import IsAdminOrManager
from dashboard.selectors import DashboardSelector
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(
    tags=["Dashboard"],
)
class DashboardAPIView(APIView):
    """
    Dashboard statistics API.
    """

    permission_classes = [
        IsAuthenticated,
        IsAdminOrManager,
    ]

    def get(self, request):
        statistics = DashboardSelector.get_statistics()

        return Response(
            {
                "role": request.user.role,
                "dashboard": statistics,
            },
            status=status.HTTP_200_OK,
        )