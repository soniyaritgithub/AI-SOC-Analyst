"""
URL configuration for config project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def healthz(request):
    """
    Public lightweight health-check endpoint for Render.
    """
    return JsonResponse(
        {
            "status": "ok",
            "service": "ai-soc-backend",
        },
        status=200,
    )


urlpatterns = [
    path(
        "healthz",
        healthz,
        name="healthz",
    ),
    path(
        "admin/",
        admin.site.urls,
    ),
    path(
        "api/system/",
        include("system.api.urls"),
    ),
    path(
        "api/accounts/",
        include("accounts.api.urls"),
    ),
    path(
        "api/dashboard/",
        include("dashboard.api.urls"),
    ),
    path(
        "api/incidents/",
        include("incidents.api.urls"),
    ),
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(
            url_name="schema",
        ),
        name="swagger-ui",
    ),
    path(
        "api/audit-logs/",
        include("audit_logs.api.urls"),
    ),
    path(
        "api/reports/",
        include("reports.api.urls"),
    ),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )