from accounts.api.serializers import ForgotPasswordSerializer
from accounts.services.auth_service import AuthService
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(tags=["Accounts"])
class ForgotPasswordAPIView(APIView):
    """
    Send password reset email.
    """
    permission_classes = [AllowAny]
    @extend_schema(
        request=ForgotPasswordSerializer,
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
        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        response = AuthService.forgot_password(
            serializer.validated_data
        )

        return Response(
            response,
            status=status.HTTP_200_OK,
        )