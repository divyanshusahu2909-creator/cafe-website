from decimal import Decimal
from django.db import models
from django.utils import timezone
from apps.core.models import TimeStampedModel
from apps.menu.models import Product

class Coupon(TimeStampedModel):
    DISCOUNT_TYPES = (
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    )

    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES, default='percentage')
    discount_value = models.DecimalField(max_digits=8, decimal_places=2)
    minimum_order_amount = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    max_discount = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    usage_limit = models.PositiveIntegerField(default=1000)
    usage_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} ({self.discount_value}{'%' if self.discount_type == 'percentage' else ' INR'})"

    def is_valid_for_subtotal(self, subtotal: Decimal):
        today = timezone.now().date()
        if not self.is_active:
            return False, "This coupon is no longer active."
        if self.usage_count >= self.usage_limit:
            return False, "This coupon usage limit has been reached."
        if self.start_date and today < self.start_date:
            return False, "This coupon is not valid yet."
        if self.end_date and today > self.end_date:
            return False, "This coupon has expired."
        if subtotal < self.minimum_order_amount:
            return False, f"Minimum order amount for this coupon is ₹{self.minimum_order_amount}."
        return True, "Coupon is valid."

    def calculate_discount(self, subtotal: Decimal) -> Decimal:
        if self.discount_type == 'percentage':
            discount = (subtotal * self.discount_value) / Decimal('100.00')
            if self.max_discount and discount > self.max_discount:
                discount = self.max_discount
        else:
            discount = min(self.discount_value, subtotal)
        return discount.quantize(Decimal('0.01'))

class Order(TimeStampedModel):
    ORDER_TYPES = (
        ('dine_in', 'Dine-In'),
        ('takeaway', 'Takeaway / Pickup'),
        ('delivery', 'Local Delivery'),
    )

    ORDER_STATUSES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready for Pickup'),
        ('out_for_delivery', 'Out for Delivery'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    PAYMENT_STATUSES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    public_reference = models.CharField(max_length=60, unique=True, db_index=True)
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True, default='')
    order_type = models.CharField(max_length=20, choices=ORDER_TYPES, default='takeaway')
    order_status = models.CharField(max_length=30, choices=ORDER_STATUSES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUSES, default='pending')

    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=10, decimal_places=2)

    coupon_code = models.CharField(max_length=50, blank=True, default='')
    delivery_address = models.TextField(blank=True, default='')
    customer_notes = models.TextField(blank=True, default='')
    table_number = models.CharField(max_length=50, blank=True, default='')
    idempotency_key = models.CharField(max_length=120, blank=True, default='', db_index=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.public_reference} - {self.customer_name} (₹{self.total})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL, related_name='order_items')
    product_name_snapshot = models.CharField(max_length=150)
    unit_price_snapshot = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product_name_snapshot} for {self.order.public_reference}"
