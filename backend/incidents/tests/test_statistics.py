from django.urls import reverse
from incidents.models import Incident
from incidents.tests.base import BaseIncidentAnalyticsTestCase
from rest_framework import status


class IncidentStatisticsAPITestCase(BaseIncidentAnalyticsTestCase):
    """
    Test suite for Incident Statistics API.
    """

    def setUp(self):
        super().setUp()

        self.url = reverse("incident-statistics")

    def test_admin_can_view_statistics(self):
        """
        Admin should be able to access statistics.
        """

        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_manager_can_view_statistics(self):
        """
        Manager should be able to access statistics.
        """

        self.authenticate(self.manager)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_soc_analyst_cannot_view_statistics(self):
        """
        SOC Analyst should not access statistics.
        """

        self.authenticate(self.analyst)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_anonymous_user_cannot_view_statistics(self):
        """
        Anonymous users should not access statistics.
        """

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_statistics_counts_are_correct(self):
        """
        Verify statistics response values.
        """

        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        data = response.data

        self.assertEqual(
            data["total_incidents"],
            3,
        )

        self.assertEqual(
            data["open"],
            1,
        )

        self.assertEqual(
            data["in_progress"],
            1,
        )

        self.assertEqual(
            data["resolved"],
            1,
        )

        self.assertEqual(
            data["closed"],
            0,
        )

    def test_statistics_empty_database(self):
        """
        Statistics should return zero values when
        there are no incidents.
        """

        Incident.objects.all().delete()

        self.authenticate(self.admin)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        data = response.data

        self.assertEqual(
            data["total_incidents"],
            0,
        )

        self.assertEqual(
            data["open"],
            0,
        )

        self.assertEqual(
            data["in_progress"],
            0,
        )

        self.assertEqual(
            data["resolved"],
            0,
        )

        self.assertEqual(
            data["closed"],
            0,
        )