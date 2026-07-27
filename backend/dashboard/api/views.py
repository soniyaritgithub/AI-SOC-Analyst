from dashboard.api.serializers import DashboardSerializer
from dashboard.services.dashboard_service import DashboardService
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class DashboardAPIView(APIView):
    """
    Authenticated SOC Dashboard API.
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        data = DashboardService.get_dashboard_data()

        serializer = DashboardSerializer(
            instance=data,
        )

        return Response(
            serializer.data,
        )