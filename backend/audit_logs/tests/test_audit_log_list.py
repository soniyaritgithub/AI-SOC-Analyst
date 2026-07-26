from audit_logs.models import AuditAction, AuditLog
from audit_logs.tests.base import BaseAuditLogTestCase


class AuditLogListAPIViewTests(BaseAuditLogTestCase):
    """
    Tests for Audit Log List API.
    """

    URL = "/api/audit-logs/"

    def test_admin_can_view_audit_logs(self):
        """
        Admin should get 200 OK.
        """
        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

    def test_manager_can_view_audit_logs(self):
        """
        Manager should get 200 OK.
        """
        self.authenticate(self.manager)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

    def test_soc_analyst_cannot_view_audit_logs(self):
        """
        SOC Analyst should get 403 Forbidden.
        """
        self.authenticate(self.analyst)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 403)

    def test_anonymous_user_cannot_view_audit_logs(self):
        """
        Anonymous user should get 401 Unauthorized.
        """
        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 401)

    def test_created_audit_log_exists_in_response(self):
        """
        Created audit log should be returned.
        """
        self.authenticate(self.admin)

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

        ids = [
            item["id"]
            for item in response.data["results"]
        ]

        self.assertIn(
            str(self.audit_log.id),
            ids,
        )

    def test_search_audit_logs(self):
        """
        Search audit logs by description.
        """
        self.authenticate(self.admin)

        response = self.client.get(
            self.URL,
            {
                "search": "Created",
            },
        )

        self.assertEqual(response.status_code, 200)

    def test_filter_by_action(self):
        """
        Filter audit logs by action.
        """
        self.authenticate(self.admin)

        response = self.client.get(
            self.URL,
            {
                "action": AuditAction.CREATED,
            },
        )

        self.assertEqual(response.status_code, 200)

        for item in response.data["results"]:
            self.assertEqual(
                item["action"],
                AuditAction.CREATED,
            )

    def test_ordering_by_created_at(self):
        """
        Order audit logs by latest first.
        """
        self.authenticate(self.admin)

        AuditLog.objects.create(
            user=self.admin,
            incident=self.incident,
            action=AuditAction.UPDATED,
            description="Updated incident.",
        )

        response = self.client.get(
            self.URL,
            {
                "ordering": "-created_at",
            },
        )

        self.assertEqual(response.status_code, 200)

    def test_pagination(self):
        """
        Audit logs should be paginated.
        """
        self.authenticate(self.admin)

        for index in range(15):
            AuditLog.objects.create(
                user=self.admin,
                incident=self.incident,
                action=AuditAction.UPDATED,
                description=f"Audit Log {index}",
            )

        response = self.client.get(self.URL)

        self.assertEqual(response.status_code, 200)

        self.assertIn("results", response.data)
        self.assertIn("count", response.data)