from audit_logs.tests.base import BaseAuditLogTestCase


class AuditLogPermissionTests(BaseAuditLogTestCase):
    """
    Permission tests for all Audit Log APIs.
    """

    def setUp(self):
        super().setUp()

        self.list_url = "/api/audit-logs/"
        self.detail_url = f"/api/audit-logs/{self.audit_log.id}/"
        self.statistics_url = "/api/audit-logs/stats/"
        self.dashboard_url = "/api/audit-logs/dashboard/"

    # ==========================================
    # Admin Permissions
    # ==========================================

    def test_admin_can_access_all_endpoints(self):
        """
        Admin should access all Audit Log APIs.
        """

        self.authenticate(self.admin)

        urls = [
            self.list_url,
            self.detail_url,
            self.statistics_url,
            self.dashboard_url,
        ]

        for url in urls:
            response = self.client.get(url)
            self.assertEqual(
                response.status_code,
                200,
                f"Failed for URL: {url}",
            )

    # ==========================================
    # Manager Permissions
    # ==========================================

    def test_manager_can_access_all_endpoints(self):
        """
        Manager should access all Audit Log APIs.
        """

        self.authenticate(self.manager)

        urls = [
            self.list_url,
            self.detail_url,
            self.statistics_url,
            self.dashboard_url,
        ]

        for url in urls:
            response = self.client.get(url)
            self.assertEqual(
                response.status_code,
                200,
                f"Failed for URL: {url}",
            )

    # ==========================================
    # SOC Analyst Permissions
    # ==========================================

    def test_soc_analyst_cannot_access_any_endpoint(self):
        """
        SOC Analyst should receive 403.
        """

        self.authenticate(self.analyst)

        urls = [
            self.list_url,
            self.detail_url,
            self.statistics_url,
            self.dashboard_url,
        ]

        for url in urls:
            response = self.client.get(url)
            self.assertEqual(
                response.status_code,
                403,
                f"Failed for URL: {url}",
            )

    # ==========================================
    # Anonymous Permissions
    # ==========================================

    def test_anonymous_user_cannot_access_any_endpoint(self):
        """
        Anonymous user should receive 401.
        """

        urls = [
            self.list_url,
            self.detail_url,
            self.statistics_url,
            self.dashboard_url,
        ]

        for url in urls:
            response = self.client.get(url)
            self.assertEqual(
                response.status_code,
                401,
                f"Failed for URL: {url}",
            )