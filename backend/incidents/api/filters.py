import django_filters
from incidents.models import Incident


class IncidentFilter(django_filters.FilterSet):
    class Meta:
        model = Incident
        fields = [
            "severity",
            "status",
        ]