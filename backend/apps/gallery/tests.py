from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import GalleryImage

class GalleryAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff_user = User.objects.create_user(
            username='galleryadmin',
            password='password123',
            is_staff=True
        )
        self.active_image = GalleryImage.objects.create(
            caption='Brew Bar Interior',
            alt_text='Artisanal espresso bar at Aesthetic Aroma',
            display_order=1,
            is_active=True
        )
        self.inactive_image = GalleryImage.objects.create(
            caption='Draft Decor',
            alt_text='Unpublished interior draft',
            display_order=2,
            is_active=False
        )

    def test_public_gallery_only_active_images(self):
        url = reverse('gallery-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['caption'], 'Brew Bar Interior')

    def test_admin_gallery_crud(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse('admin-gallery-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Admin should see both active and inactive
        results = response.data['results'] if 'results' in response.data else response.data
        self.assertEqual(len(results), 2)
