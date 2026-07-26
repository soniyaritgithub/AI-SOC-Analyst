from django.urls import reverse
from incidents.models import Incident
from incidents.tests.base import BaseIncidentAnalyticsTestCase
from rest_framework import status


class IncidentStatusAPITestCase(BaseIncidentAnalyticsTestCase):
    """
    Test suite for Incident Status Distribution API.
    """

    def setUp(self):
        super().setUp()

        self.url = reverse("incident-status-distribution")

    def test_admin_can_view_status_distribution(self):
        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_manager_can_view_status_distribution(self):
        self.authenticate(self.manager)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_soc_analyst_cannot_view_status_distribution(self):
        self.authenticate(self.analyst)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_anonymous_user_cannot_view_status_distribution(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_status_distribution_data(self):
        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            3,
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