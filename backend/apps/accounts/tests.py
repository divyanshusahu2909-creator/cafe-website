from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AccountsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff_user = User.objects.create_user(
            username='staffuser',
            password='secretpassword123',
            email='staff@aestheticaroma.com',
            is_staff=True
        )
        self.regular_user = User.objects.create_user(
            username='regularuser',
            password='secretpassword123',
            email='user@example.com',
            is_staff=False
        )

    def test_csrf_cookie_endpoint(self):
        url = reverse('admin-csrf')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('csrftoken', response.cookies)

    def test_staff_login_success(self):
        url = reverse('admin-login')
        payload = {
            'username': 'staffuser',
            'password': 'secretpassword123'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'staffuser')
        self.assertTrue(response.data['user']['is_staff'])

    def test_non_staff_login_rejected(self):
        url = reverse('admin-login')
        payload = {
            'username': 'regularuser',
            'password': 'secretpassword123'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Staff privileges', str(response.data))

    def test_invalid_credentials_rejected(self):
        url = reverse('admin-login')
        payload = {
            'username': 'staffuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_current_user_authenticated(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse('admin-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'staffuser')

    def test_current_user_unauthenticated(self):
        url = reverse('admin-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
