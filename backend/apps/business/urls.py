from django.urls import path
from .views import (
    PublicBusinessSettingsView,
    AdminBusinessSettingsView,
    AdminDashboardMetricsView,
)

urlpatterns = [
    path('business-settings/', PublicBusinessSettingsView.as_view(), name='public-business-settings'),
    path('admin/business-settings/', AdminBusinessSettingsView.as_view(), name='admin-business-settings'),
    path('admin/dashboard/', AdminDashboardMetricsView.as_view(), name='admin-dashboard-metrics'),
]
