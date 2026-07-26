from accounts.api.serializers import ProfileSerializer
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class ProfileAPIView(APIView):
    """
    Return authenticated user's profile.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: ProfileSerializer},
    )
    def get(self, request):
        serializer = ProfileSerializer(request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )