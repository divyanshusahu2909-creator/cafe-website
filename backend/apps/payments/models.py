from decimal import Decimal
from django.db import models
from apps.core.models import TimeStampedModel
from apps.orders.models import Order

class Payment(TimeStampedModel):
    PROVIDERS = (
        ('demo', 'Demo Simulator'),
        ('razorpay', 'Razorpay'),
    )

    PAYMENT_STATUSES = (
        ('pending', 'Pending'),
        ('authorized', 'Authorized'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    order = models.ForeignKey(Order, related_name='payments', on_delete=models.CASCADE)
    provider = models.CharField(max_length=30, choices=PROVIDERS, default='demo')
    provider_payment_reference = models.CharField(max_length=150, blank=True, default='')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(max_length=30, choices=PAYMENT_STATUSES, default='pending')
    provider_event_id = models.CharField(max_length=150, blank=True, default='')
    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.id} for Order {self.order.public_reference} - {self.status} (₹{self.amount})"
