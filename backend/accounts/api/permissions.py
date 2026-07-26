from accounts.models import UserRole
from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allow only Admin users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.ADMIN
        )


class IsManager(BasePermission):
    """
    Allow only Manager users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.MANAGER
        )


class IsSOCAnalyst(BasePermission):
    """
    Allow only SOC Analyst users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.SOC_ANALYST
        )


class IsAdminOrManager(BasePermission):
    """
    Allow Admin or Manager users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                UserRole.ADMIN,
                UserRole.MANAGER,
            ]
        )