import os
import uuid
from decimal import Decimal
from django.utils import timezone
from apps.orders.models import Order
from .models import Payment

class PaymentError(Exception):
    pass

class DemoPaymentProvider:
    """
    Demo Payment Simulator.
    Strictly for local development and portfolio demonstration.
    Does not transfer real funds.
    """
    def process_payment(self, order: Order, simulate_failure: bool = False):
        if simulate_failure:
            payment = Payment.objects.create(
                order=order,
                provider='demo',
                provider_payment_reference=f"DEMO-FAIL-{uuid.uuid4().hex[:8].upper()}",
                amount=order.total,
                currency='INR',
                status='failed',
            )
            order.payment_status = 'failed'
            order.save(update_fields=['payment_status', 'updated_at'])
            return {
                'success': False,
                'status': 'failed',
                'payment_id': payment.id,
                'message': 'Simulated demo payment failure.'
            }

        payment_ref = f"DEMO-TXN-{uuid.uuid4().hex[:10].upper()}"
        payment = Payment.objects.create(
            order=order,
            provider='demo',
            provider_payment_reference=payment_ref,
            amount=order.total,
            currency='INR',
            status='paid',
            verified_at=timezone.now(),
        )

        order.payment_status = 'paid'
        if order.order_status == 'pending':
            order.order_status = 'confirmed'
        order.save(update_fields=['payment_status', 'order_status', 'updated_at'])

        return {
            'success': True,
            'status': 'paid',
            'payment_id': payment.id,
            'transaction_reference': payment_ref,
            'disclaimer': 'Demo payment — no real money will be charged.',
            'order_reference': order.public_reference,
            'amount': str(order.total)
        }

class RazorpayPaymentProvider:
    """
    Razorpay Integration Boundary.
    Safely requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.
    Never exposes secrets or fakes external verification.
    """
    def __init__(self):
        self.key_id = os.getenv('RAZORPAY_KEY_ID', '').strip()
        self.key_secret = os.getenv('RAZORPAY_KEY_SECRET', '').strip()

    def is_configured(self) -> bool:
        return bool(self.key_id and self.key_secret)

    def create_order(self, order: Order):
        if not self.is_configured():
            raise PaymentError(
                "Razorpay is not configured on this server. "
                "Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET or use the demo checkout."
            )
        # Placeholder for real razorpay client initialization when keys are provided
        pass

    def verify_signature(self, razorpay_order_id, razorpay_payment_id, signature):
        if not self.is_configured():
            raise PaymentError("Razorpay credentials missing.")
        # Placeholder for hmac sha256 verification
        return False
