from audit_logs.models import AuditAction, AuditLog
from audit_logs.tests.base import BaseAuditLogTestCase


class AuditLogStatisticsAPIViewTests(BaseAuditLogTestCase):
    """
    Tests for Audit Log Statistics API.
    """

    URL = "/api/audit-logs/stats/"

    def test_admin_can_view_statistics(self):
        """
        Admin should get 200 OK.
        """
        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

    def test_manager_can_view_statistics(self):
        """
        Manager should get 200 OK.
        """
        self.authenticate(self.manager)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

    def test_soc_analyst_cannot_view_statistics(self):
        """
        SOC Analyst should get 403 Forbidden.
        """
        self.authenticate(self.analyst)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 403)

    def test_anonymous_user_cannot_view_statistics(self):
        """
        Anonymous user should get 401 Unauthorized.
        """
        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 401)

    def test_statistics_counts_are_correct(self):
        """
        Statistics should return correct counts.
        """

        AuditLog.objects.all().delete()

        actions = [
            AuditAction.CREATED,
            AuditAction.CREATED,
            AuditAction.CREATED,
            AuditAction.UPDATED,
            AuditAction.UPDATED,
            AuditAction.ASSIGNED,
            AuditAction.ASSIGNED,
            AuditAction.STATUS_CHANGED,
            AuditAction.STATUS_CHANGED,
            AuditAction.DELETED,
        ]

        for action in actions:
            AuditLog.objects.create(
                user=self.admin,
                incident=self.incident,
                action=action,
                description=f"{action} test log",
            )

        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data["total_logs"], 10)
        self.assertEqual(response.data["created"], 3)
        self.assertEqual(response.data["updated"], 2)
        self.assertEqual(response.data["assigned"], 2)
        self.assertEqual(response.data["status_changed"], 2)
        self.assertEqual(response.data["deleted"], 1)

    def test_empty_statistics(self):
        """
        Statistics should return zero when no logs exist.
        """

        AuditLog.objects.all().delete()

        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data["total_logs"], 0)
        self.assertEqual(response.data["created"], 0)
        self.assertEqual(response.data["updated"], 0)
        self.assertEqual(response.data["assigned"], 0)
        self.assertEqual(response.data["status_changed"], 0)
        self.assertEqual(response.data["deleted"], 0)