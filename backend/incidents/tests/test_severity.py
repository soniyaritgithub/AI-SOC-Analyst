from django.urls import reverse
from incidents.models import Incident
from incidents.tests.base import BaseIncidentAnalyticsTestCase
from rest_framework import status


class IncidentSeverityAPITestCase(BaseIncidentAnalyticsTestCase):
    """
    Test suite for Incident Severity Distribution API.
    """

    def setUp(self):
        super().setUp()

        self.url = reverse("incident-severity")

    def test_admin_can_view_severity_distribution(self):
        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_manager_can_view_severity_distribution(self):
        self.authenticate(self.manager)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_soc_analyst_cannot_view_severity_distribution(self):
        self.authenticate(self.analyst)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_anonymous_user_cannot_view_severity_distribution(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_severity_distribution_data(self):
        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        data = response.data

        self.assertEqual(
            len(data),
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