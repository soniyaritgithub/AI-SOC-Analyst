from accounts.api.serializers import ResetPasswordSerializer
from accounts.services.auth_service import AuthService
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(tags=["Accounts"])
class ResetPasswordAPIView(APIView):
    """
    Reset password using UID and token.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        request=ResetPasswordSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string"
                    }
                },
            },
        },
    )
    def post(self, request):
        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        response = AuthService.reset_password(
            serializer.validated_data
        )

        return Response(
            response,
            status=status.HTTP_200_OK,
        )