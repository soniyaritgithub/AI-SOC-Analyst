from django.urls import reverse
from incidents.models import Incident
from incidents.tests.base import BaseIncidentAnalyticsTestCase
from rest_framework import status


class IncidentTrendAPITestCase(BaseIncidentAnalyticsTestCase):
    """
    Test suite for Monthly Trends API.
    """

    def setUp(self):
        super().setUp()

        self.url = reverse("incident-trends")

    def test_admin_can_view_monthly_trends(self):
        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_manager_can_view_monthly_trends(self):
        self.authenticate(self.manager)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_soc_analyst_cannot_view_monthly_trends(self):
        self.authenticate(self.analyst)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_anonymous_user_cannot_view_monthly_trends(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_monthly_trends_data(self):
        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertGreaterEqual(
            len(response.data),
            1,
        )

    def test_empty_database_returns_empty_list(self):
        Incident.objects.all().delete()

        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data,
            [],
        )