from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.orders.models import Order
from .models import Payment

class PaymentAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.order = Order.objects.create(
            public_reference="AA-ORD-PAY-TEST",
            customer_name="Payment Tester",
            customer_phone="+91 9999988888",
            order_type="takeaway",
            order_status="pending",
            payment_status="pending",
            subtotal=Decimal("250.00"),
            total=Decimal("250.00"),
        )

    def test_demo_payment_success(self):
        url = reverse('payment-demo')
        payload = {'order_reference': 'AA-ORD-PAY-TEST'}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['status'], 'paid')
        self.assertIn('Demo payment', response.data['disclaimer'])

        # Verify DB changes
        self.order.refresh_from_db()
        self.assertEqual(self.order.payment_status, 'paid')
        self.assertEqual(self.order.order_status, 'confirmed')

        payment = Payment.objects.filter(order=self.order).first()
        self.assertIsNotNone(payment)
        self.assertEqual(payment.status, 'paid')
        self.assertEqual(payment.provider, 'demo')

    def test_cannot_pay_already_paid_order(self):
        self.order.payment_status = 'paid'
        self.order.save()

        url = reverse('payment-demo')
        payload = {'order_reference': 'AA-ORD-PAY-TEST'}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already marked as paid', response.data['detail'])

    def test_unconfigured_gateway_endpoint(self):
        url = reverse('payment-gateway-order')
        response = self.client.post(url, {}, format='json')
        # Returns 503 Service Unavailable when Razorpay keys are not set
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertFalse(response.data['configured'])
