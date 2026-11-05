import datetime
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import CafeTable, Reservation

class ReservationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.table = CafeTable.objects.create(
            table_number="T1 - Window",
            capacity=4,
            location="indoor",
            is_active=True
        )

    def test_create_valid_reservation(self):
        url = reverse('reservation-create')
        tomorrow = timezone.localdate() + datetime.timedelta(days=1)
        payload = {
            'customer_name': 'Aarav Gupta',
            'customer_phone': '+91 9876543210',
            'customer_email': 'aarav@example.com',
            'reservation_date': tomorrow.isoformat(),
            'reservation_time': '18:30:00',
            'guest_count': 2,
            'special_requests': 'Window view please.'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'pending')
        self.assertTrue(response.data['reference'].startswith('AA-RES-'))

    def test_reject_past_date(self):
        url = reverse('reservation-create')
        yesterday = timezone.localdate() - datetime.timedelta(days=1)
        payload = {
            'customer_name': 'Late Guest',
            'customer_phone': '+91 9876543210',
            'reservation_date': yesterday.isoformat(),
            'reservation_time': '18:30:00',
            'guest_count': 2,
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('reservation_date', response.data)

    def test_reject_outside_opening_hours(self):
        url = reverse('reservation-create')
        tomorrow = timezone.localdate() + datetime.timedelta(days=1)
        payload = {
            'customer_name': 'Midnight Guest',
            'customer_phone': '+91 9876543210',
            'reservation_date': tomorrow.isoformat(),
            'reservation_time': '02:00:00',  # 2 AM
            'guest_count': 2,
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('reservation_time', response.data)

    def test_reservation_lookup(self):
        tomorrow = timezone.localdate() + datetime.timedelta(days=1)
        res = Reservation.objects.create(
            reference='AA-RES-TEST-0001',
            customer_name='Meera Sen',
            customer_phone='+91 9876543210',
            reservation_date=tomorrow,
            reservation_time=datetime.time(19, 0),
            guest_count=4,
            status='confirmed',
            table=self.table
        )
        url = reverse('reservation-public-detail', kwargs={'reference': 'AA-RES-TEST-0001'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['customer_name'], 'Meera Sen')
        self.assertEqual(response.data['table_number'], 'T1 - Window')
