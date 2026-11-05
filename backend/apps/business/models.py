from decimal import Decimal
from django.db import models
from apps.core.models import TimeStampedModel

class BusinessSettings(TimeStampedModel):
    name = models.CharField(max_length=150, default="Aesthetic Aroma")
    tagline = models.CharField(max_length=200, default="Where Every Sip Feels Special.")
    description = models.TextField(
        default="Indore's premier aesthetic vegetarian sanctuary. Crafted artisan coffees, European-inspired patisserie, and cinematic tranquility."
    )
    city = models.CharField(max_length=100, default="Indore")
    state = models.CharField(max_length=100, default="Madhya Pradesh")
    country = models.CharField(max_length=100, default="India")
    address_placeholder = models.CharField(
        max_length=300,
        default="Scheme 54, Near Meghdoot Garden, Vijay Nagar, Indore, MP 452010"
    )
    phone = models.CharField(max_length=30, default="+91 98765 43210")
    email = models.EmailField(default="contact@aestheticaroma.com")
    whatsapp_number = models.CharField(max_length=30, default="+919876543210")

    opening_time = models.TimeField(default="10:00")
    closing_time = models.TimeField(default="22:30")
    opening_days = models.CharField(max_length=100, default="Monday – Sunday (All Days)")

    delivery_available = models.BooleanField(default=True)
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('40.00'))
    free_delivery_threshold = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('500.00'))

    currency = models.CharField(max_length=10, default="INR")
    currency_symbol = models.CharField(max_length=5, default="₹")

    google_maps_url = models.URLField(
        default="https://maps.google.com/?q=Vijay+Nagar+Indore+Madhya+Pradesh"
    )
    instagram_handle = models.CharField(max_length=100, blank=True, default="@aesthetic.aroma.indore")

    class Meta:
        verbose_name = 'Business Settings'
        verbose_name_plural = 'Business Settings'

    def __str__(self):
        return f"{self.name} Settings"

    @classmethod
    def get_settings(cls):
        settings, _ = cls.objects.get_or_create(id=1)
        return settings
