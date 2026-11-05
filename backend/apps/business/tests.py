from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import BusinessSettings

class BusinessAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.settings = BusinessSettings.get_settings()
        self.admin = User.objects.create_superuser('admin_tester', 'admin@test.com', 'testpass123')

    def test_public_business_settings(self):
        url = reverse('public-business-settings')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Aesthetic Aroma')
        self.assertEqual(response.data['city'], 'Indore')
        self.assertEqual(response.data['currency_symbol'], '₹')

    def test_admin_dashboard_metrics_unauthorized(self):
        url = reverse('admin-dashboard-metrics')
        response = self.client.get(url)
        # Should reject unauthenticated requests
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_dashboard_metrics_authorized(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('admin-dashboard-metrics')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('metrics', response.data)
        self.assertIn('total_orders', response.data['metrics'])
