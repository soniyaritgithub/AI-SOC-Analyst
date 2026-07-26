from django.urls import reverse
from incidents.models import Incident
from incidents.tests.base import BaseIncidentAnalyticsTestCase
from rest_framework import status


class IncidentDashboardAPITestCase(BaseIncidentAnalyticsTestCase):
    """
    Test suite for Dashboard API.
    """

    def setUp(self):
        super().setUp()

        self.url = reverse("incident-dashboard")

    def test_admin_can_view_dashboard(self):
        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_manager_can_view_dashboard(self):
        self.authenticate(self.manager)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_soc_analyst_cannot_view_dashboard(self):
        self.authenticate(self.analyst)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_anonymous_user_cannot_view_dashboard(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_dashboard_response_contains_required_keys(self):
        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        data = response.data

        self.assertIn("statistics", data)
        self.assertIn("severity_distribution", data)
        self.assertIn("status_distribution", data)
        self.assertIn("analyst_performance", data)
        self.assertIn("monthly_trends", data)
        self.assertIn("recent_incidents", data)

    def test_empty_database_dashboard(self):
        Incident.objects.all().delete()

        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        data = response.data

        self.assertIn("statistics", data)
        self.assertIn("severity_distribution", data)
        self.assertIn("status_distribution", data)
        self.assertIn("analyst_performance", data)
        self.assertIn("monthly_trends", data)
        self.assertIn("recent_incidents", data)