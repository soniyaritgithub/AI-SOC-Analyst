import uuid

from audit_logs.tests.base import BaseAuditLogTestCase


class AuditLogDetailAPIViewTests(BaseAuditLogTestCase):
    """
    Tests for Audit Log Detail API.
    """

    def get_url(self, audit_log_id):
        """
        Build detail endpoint URL.
        """
        return f"/api/audit-logs/{audit_log_id}/"

    def test_admin_can_view_audit_log_detail(self):
        """
        Admin should get 200 OK.
        """
        self.authenticate(self.admin)

        response = self.client.get(
            self.get_url(self.audit_log.id)
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["id"],
            str(self.audit_log.id),
        )

    def test_manager_can_view_audit_log_detail(self):
        """
        Manager should get 200 OK.
        """
        self.authenticate(self.manager)

        response = self.client.get(
            self.get_url(self.audit_log.id)
        )

        self.assertEqual(response.status_code, 200)

    def test_soc_analyst_cannot_view_audit_log_detail(self):
        """
        SOC Analyst should get 403 Forbidden.
        """
        self.authenticate(self.analyst)

        response = self.client.get(
            self.get_url(self.audit_log.id)
        )

        self.assertEqual(response.status_code, 403)

    def test_anonymous_user_cannot_view_audit_log_detail(self):
        """
        Anonymous user should get 401 Unauthorized.
        """
        response = self.client.get(
            self.get_url(self.audit_log.id)
        )

        self.assertEqual(response.status_code, 401)

    def test_invalid_uuid_returns_404(self):
        """
        Invalid UUID should return 404.
        """
        self.authenticate(self.admin)

        response = self.client.get(
            self.get_url(
                "11111111-1111-1111-1111-111111111111"
            )
        )

        self.assertEqual(response.status_code, 404)

    def test_non_existing_uuid_returns_404(self):
        """
        Valid UUID but not present in DB.
        """
        self.authenticate(self.admin)

        random_uuid = uuid.uuid4()

        response = self.client.get(
            self.get_url(random_uuid)
        )

        self.assertEqual(response.status_code, 404)

    def test_response_contains_required_fields(self):
        """
        Response should contain all required fields.
        """
        self.authenticate(self.admin)

        response = self.client.get(
            self.get_url(self.audit_log.id)
        )

        self.assertEqual(response.status_code, 200)

        self.assertIn("id", response.data)
        self.assertIn("user", response.data)
        self.assertIn("incident", response.data)
        self.assertIn("action", response.data)
        self.assertIn("description", response.data)
        self.assertIn("created_at", response.data)

        self.assertEqual(
            response.data["id"],
            str(self.audit_log.id),
        )