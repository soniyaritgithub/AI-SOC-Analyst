from typing import Any, cast

from accounts.api.serializers import LogoutSerializer
from accounts.services.auth_service import AuthService
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class LogoutAPIView(APIView):
    """
    Logout user and blacklist refresh token.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=LogoutSerializer,
        responses={200: dict},
    )
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = cast(dict[str, Any], serializer.validated_data)

        refresh = validated_data["refresh"]

        data = AuthService.logout_user(refresh)

        return Response(
            data,
            status=status.HTTP_200_OK,
        )