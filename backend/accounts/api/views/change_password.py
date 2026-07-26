from accounts.api.serializers import ChangePasswordSerializer
from accounts.services.auth_service import AuthService
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


@extend_schema(
    tags=["Accounts"],
)
class ChangePasswordAPIView(APIView):
    """
    Change password for the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ChangePasswordSerializer,
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
        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        response = AuthService.change_password(
            request.user,
            serializer.validated_data,
        )

        return Response(
            response,
            status=status.HTTP_200_OK,
        )