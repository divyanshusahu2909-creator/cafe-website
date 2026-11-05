from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.menu.models import Category, Product
from .models import Coupon, Order

class OrderAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Hot Coffee", slug="hot-coffee")
        self.product1 = Product.objects.create(
            category=self.category,
            name="Cappuccino",
            slug="cappuccino",
            price=Decimal("150.00"),
            is_available=True
        )
        self.product2 = Product.objects.create(
            category=self.category,
            name="Espresso",
            slug="espresso",
            price=Decimal("100.00"),
            is_available=True
        )
        self.coupon = Coupon.objects.create(
            code="WELCOME50",
            discount_type="percentage",
            discount_value=Decimal("50.00"),
            minimum_order_amount=Decimal("100.00"),
            max_discount=Decimal("100.00"),
            is_active=True
        )

    def test_coupon_validation(self):
        url = reverse('coupon-validate')
        response = self.client.post(url, {
            'code': 'WELCOME50',
            'subtotal': '250.00'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['valid'])
        # 50% of 250 is 125, but max discount is 100
        self.assertEqual(response.data['discount_amount'], '100.00')

    def test_create_order_server_side_calculation(self):
        url = reverse('order-create')
        payload = {
            'customer_name': 'Test Customer',
            'customer_phone': '+91 9999999999',
            'order_type': 'takeaway',
            'coupon_code': 'WELCOME50',
            'items': [
                {'product_id': self.product1.id, 'quantity': 2}, # 150 * 2 = 300
                {'product_id': self.product2.id, 'quantity': 1}, # 100 * 1 = 100
            ]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data

        # Server recalculated subtotal: 300 + 100 = 400
        self.assertEqual(data['subtotal'], '400.00')
        # Coupon discount: 50% of 400 = 200, but capped at 100
        self.assertEqual(data['discount_amount'], '100.00')
        # Takeaway delivery fee: 0
        self.assertEqual(data['delivery_fee'], '0.00')
        # Total: 400 - 100 = 300
        self.assertEqual(data['total'], '300.00')
        self.assertEqual(data['order_status'], 'pending')
        self.assertEqual(data['payment_status'], 'pending')
        self.assertTrue(data['public_reference'].startswith('AA-ORD-'))

    def test_delivery_order_requires_address(self):
        url = reverse('order-create')
        payload = {
            'customer_name': 'Test Customer',
            'customer_phone': '+91 9999999999',
            'order_type': 'delivery',
            'delivery_address': '',  # missing address
            'items': [{'product_id': self.product1.id, 'quantity': 1}]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('delivery_address', response.data)

    def test_idempotency_protection(self):
        url = reverse('order-create')
        payload = {
            'customer_name': 'Idempotent Customer',
            'customer_phone': '+91 9999999999',
            'order_type': 'takeaway',
            'idempotency_key': 'unique-idem-token-12345',
            'items': [{'product_id': self.product1.id, 'quantity': 1}]
        }
        # First submission
        res1 = self.client.post(url, payload, format='json')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        ref1 = res1.data['public_reference']

        # Duplicate submission with same idempotency key
        res2 = self.client.post(url, payload, format='json')
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res2.data['public_reference'], ref1)
        self.assertEqual(Order.objects.filter(idempotency_key='unique-idem-token-12345').count(), 1)
