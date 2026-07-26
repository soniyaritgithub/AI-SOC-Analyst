from dashboard.api.serializers import DashboardSerializer
from dashboard.services.dashboard_service import DashboardService
from rest_framework.response import Response
from rest_framework.views import APIView


class DashboardAPIView(APIView):
    """
    Threat Feed Dashboard API
    """

    def get(self, request):

        data = DashboardService.get_dashboard()

        serializer = DashboardSerializer(data)

        return Response(serializer.data)