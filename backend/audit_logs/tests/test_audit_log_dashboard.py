from audit_logs.models import AuditAction, AuditLog
from audit_logs.tests.base import BaseAuditLogTestCase


class AuditLogDashboardAPIViewTests(BaseAuditLogTestCase):
    """
    Tests for Audit Log Dashboard API.
    """

    URL = "/api/audit-logs/dashboard/"

    def test_admin_can_view_dashboard(self):
        """
        Admin should get 200 OK.
        """
        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

    def test_manager_can_view_dashboard(self):
        """
        Manager should get 200 OK.
        """
        self.authenticate(self.manager)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

    def test_soc_analyst_cannot_view_dashboard(self):
        """
        SOC Analyst should get 403 Forbidden.
        """
        self.authenticate(self.analyst)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 403)

    def test_anonymous_user_cannot_view_dashboard(self):
        """
        Anonymous user should get 401 Unauthorized.
        """
        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 401)

    def test_dashboard_contains_statistics_and_recent_logs(self):
        """
        Dashboard response should contain statistics
        and recent_logs.
        """
        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

        self.assertIn("statistics", response.data)
        self.assertIn("recent_logs", response.data)

    def test_recent_logs_are_limited_to_ten(self):
        """
        Dashboard should return maximum 10 recent logs.
        """

        AuditLog.objects.all().delete()

        for index in range(15):
            AuditLog.objects.create(
                user=self.admin,
                incident=self.incident,
                action=AuditAction.CREATED,
                description=f"Audit Log {index}",
            )

        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

        self.assertLessEqual(
            len(response.data["recent_logs"]),
            10,
        )

    def test_recent_logs_are_latest_first(self):
        """
        Recent logs should be ordered by newest first.
        """

        AuditLog.objects.all().delete()

        first = AuditLog.objects.create(
            user=self.admin,
            incident=self.incident,
            action=AuditAction.CREATED,
            description="Old Log",
        )

        second = AuditLog.objects.create(
            user=self.admin,
            incident=self.incident,
            action=AuditAction.UPDATED,
            description="Latest Log",
        )

        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

        logs = response.data["recent_logs"]

        self.assertEqual(
            logs[0]["id"],
            str(second.id),
        )

        self.assertEqual(
            logs[1]["id"],
            str(first.id),
        )

    def test_dashboard_with_no_logs(self):
        """
        Dashboard should work even if there are no logs.
        """

        AuditLog.objects.all().delete()

        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.data["statistics"]["total_logs"],
            0,
        )

        self.assertEqual(
            len(response.data["recent_logs"]),
            0,
        )