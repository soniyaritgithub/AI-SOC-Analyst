from accounts.models import User, UserRole
from incidents.models import Incident, IncidentSeverity, IncidentStatus
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken


class BaseIncidentAnalyticsTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create_user(
            email="admin@example.com",
            password="Admin@123",
            full_name="Admin User",
            role=UserRole.ADMIN,
        )

        self.manager = User.objects.create_user(
            email="manager@example.com",
            password="Manager@123",
            full_name="Manager User",
            role=UserRole.MANAGER,
        )

        self.analyst = User.objects.create_user(
            email="analyst@example.com",
            password="Analyst@123",
            full_name="SOC Analyst",
            role=UserRole.SOC_ANALYST,
        )

        self.incident1 = Incident.objects.create(
            title="Unauthorized Login",
            description="Multiple failed login attempts detected.",
            severity=IncidentSeverity.HIGH,
            status=IncidentStatus.OPEN,
            assigned_to=self.analyst,
            created_by=self.admin,
        )

        self.incident2 = Incident.objects.create(
            title="Malware Detected",
            description="Malware found on workstation.",
            severity=IncidentSeverity.CRITICAL,
            status=IncidentStatus.IN_PROGRESS,
            assigned_to=self.analyst,
            created_by=self.manager,
        )

        self.incident3 = Incident.objects.create(
            title="Phishing Email",
            description="Suspicious phishing email reported.",
            severity=IncidentSeverity.MEDIUM,
            status=IncidentStatus.RESOLVED,
            assigned_to=self.manager,
            created_by=self.admin,
        )

    def authenticate(self, user):
        refresh = RefreshToken.for_user(user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )

    def logout(self):
        self.client.credentials()