from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Review

class ReviewAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff_user = User.objects.create_user(
            username='adminuser',
            password='adminpassword123',
            is_staff=True
        )
        self.approved_review = Review.objects.create(
            name='Aarav Patel',
            rating=5,
            review_text='Exquisite coffee and serene vibe.',
            is_approved=True,
            is_demo=True
        )
        self.unapproved_review = Review.objects.create(
            name='Sneha Shah',
            rating=4,
            review_text='Great atmosphere.',
            is_approved=False,
            is_demo=False
        )

    def test_public_review_list_only_approved(self):
        url = reverse('review-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only contain 1 review (the approved one)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Aarav Patel')

    def test_submit_review_sets_unapproved_by_default(self):
        url = reverse('review-list-create')
        payload = {
            'name': 'Pooja Mehta',
            'rating': 5,
            'review_text': 'Loved the pistachio latte!'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data['is_approved'])

        # Verify in DB
        created = Review.objects.get(name='Pooja Mehta')
        self.assertFalse(created.is_approved)
        self.assertFalse(created.is_demo)

    def test_admin_review_moderation(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse('admin-reviews-detail', kwargs={'pk': self.unapproved_review.pk})
        
        # Approve review
        response = self.client.patch(url, {'is_approved': True}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.unapproved_review.refresh_from_db()
        self.assertTrue(self.unapproved_review.is_approved)
