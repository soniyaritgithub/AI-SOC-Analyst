from accounts.api.serializers import RegisterSerializer
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


class RegisterAPIView(CreateAPIView):
    """
    Register a new user.
    """

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "User registered successfully.",
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role,
                },
            },
            status=status.HTTP_201_CREATED,
        )