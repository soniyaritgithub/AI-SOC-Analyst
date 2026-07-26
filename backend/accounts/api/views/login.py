from typing import Any, cast

from accounts.api.serializers import LoginSerializer
from accounts.services.auth_service import AuthService
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class LoginAPIView(APIView):
    """
    Login user and return JWT tokens.
    """

    permission_classes = [AllowAny]
    @extend_schema(
    request=LoginSerializer,
    responses={200: dict},
    )

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = cast(dict[str, Any], serializer.validated_data)

        user = validated_data["user"]

        data = AuthService.login_user(user)

        return Response(
            data,
            status=status.HTTP_200_OK,
        )