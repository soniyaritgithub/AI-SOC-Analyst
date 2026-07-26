from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, UserRole
from incidents.models import (
    Incident,
    IncidentSeverity,
    IncidentStatus,
)
from audit_logs.models import (
    AuditAction,
    AuditLog,
)


class BaseAuditLogTestCase(APITestCase):
    """
    Base Test Case for Audit Log APIs.
    """

    def setUp(self):
        self.client = APIClient()

        # ==========================
        # Admin User
        # ==========================

        self.admin = User.objects.create_user(
            email="admin@example.com",
            password="Admin@123",
            full_name="Admin User",
            role=UserRole.ADMIN,
        )

        # ==========================
        # Manager User
        # ==========================

        self.manager = User.objects.create_user(
            email="manager@example.com",
            password="Manager@123",
            full_name="Manager User",
            role=UserRole.MANAGER,
        )

        # ==========================
        # SOC Analyst
        # ==========================

        self.analyst = User.objects.create_user(
            email="analyst@example.com",
            password="Analyst@123",
            full_name="SOC Analyst",
            role=UserRole.SOC_ANALYST,
        )

        # ==========================
        # Incident
        # ==========================

        self.incident = Incident.objects.create(
            incident_id="INC-000001",
            title="Suspicious Login",
            description="Multiple failed login attempts.",
            severity=IncidentSeverity.HIGH,
            status=IncidentStatus.OPEN,
            created_by=self.admin,
            assigned_to=self.analyst,
        )

        # ==========================
        # Audit Log
        # ==========================

        self.audit_log = AuditLog.objects.create(
            user=self.admin,
            incident=self.incident,
            action=AuditAction.CREATED,
            description="Created incident INC-000001.",
        )

    # =====================================
    # Authentication Helpers
    # =====================================

    def authenticate(self, user):
        """
        Authenticate any user using JWT.
        """
        refresh = RefreshToken.for_user(user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )