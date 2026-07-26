from accounts.models import UserRole
from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allow only Admin users.
    """

    message = "Admin access is required."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.ADMIN
        )


class IsManager(BasePermission):
    """
    Allow only Manager users.
    """

    message = "Manager access is required."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.MANAGER
        )


class IsSOCAnalyst(BasePermission):
    """
    Allow only SOC Analyst users.
    """

    message = "SOC Analyst access is required."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == UserRole.SOC_ANALYST
        )


class IsAdminOrManager(BasePermission):
    """
    Allow Admin or Manager users.
    """

    message = "Admin or Manager access is required."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role
            in (
                UserRole.ADMIN,
                UserRole.MANAGER,
            )
        )


class IsSOCMember(BasePermission):
    """
    Allow authenticated Admin, Manager,
    or SOC Analyst users.
    """

    message = "SOC access is required."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role
            in (
                UserRole.ADMIN,
                UserRole.MANAGER,
                UserRole.SOC_ANALYST,
            )
        )