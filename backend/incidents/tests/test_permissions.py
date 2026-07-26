from django.urls import reverse
from incidents.tests.base import BaseIncidentAnalyticsTestCase
from rest_framework import status


class IncidentPermissionAPITestCase(BaseIncidentAnalyticsTestCase):
    """
    Permission tests for all Incident Analytics APIs.
    """

    def setUp(self):
        super().setUp()

        self.urls = [
            reverse("incident-statistics"),
            reverse("incident-severity"),
            reverse("incident-status-distribution"),
            reverse("incident-analyst-performance"),
            reverse("incident-trends"),
            reverse("incident-dashboard"),
        ]

    def test_admin_can_access_all_analytics_apis(self):
        self.authenticate(self.admin)

        for url in self.urls:
            response = self.client.get(url)

            self.assertEqual(
                response.status_code,
                status.HTTP_200_OK,
            )

    def test_manager_can_access_all_analytics_apis(self):
        self.authenticate(self.manager)

        for url in self.urls:
            response = self.client.get(url)

            self.assertEqual(
                response.status_code,
                status.HTTP_200_OK,
            )

    def test_soc_analyst_cannot_access_all_analytics_apis(self):
        self.authenticate(self.analyst)

        for url in self.urls:
            response = self.client.get(url)

            self.assertEqual(
                response.status_code,
                status.HTTP_403_FORBIDDEN,
            )

    def test_anonymous_user_cannot_access_all_analytics_apis(self):
        for url in self.urls:
            response = self.client.get(url)

            self.assertEqual(
                response.status_code,
                status.HTTP_401_UNAUTHORIZED,
            )