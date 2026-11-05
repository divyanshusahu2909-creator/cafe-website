from django.db import models
from apps.core.models import TimeStampedModel

class CafeTable(TimeStampedModel):
    LOCATIONS = (
        ('indoor', 'Indoor Dining'),
        ('patio', 'Outdoor Patio'),
        ('lounge', 'Velvet Lounge'),
    )

    table_number = models.CharField(max_length=50, unique=True)
    capacity = models.PositiveIntegerField(default=4)
    location = models.CharField(max_length=20, choices=LOCATIONS, default='indoor')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['table_number']

    def __str__(self):
        return f"{self.table_number} ({self.get_location_display()} - {self.capacity} seats)"

class Reservation(TimeStampedModel):
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    reference = models.CharField(max_length=60, unique=True, db_index=True)
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True, default='')
    reservation_date = models.DateField(db_index=True)
    reservation_time = models.TimeField()
    guest_count = models.PositiveIntegerField(default=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    special_requests = models.TextField(blank=True, default='')
    admin_notes = models.TextField(blank=True, default='')
    table = models.ForeignKey(CafeTable, null=True, blank=True, on_delete=models.SET_NULL, related_name='reservations')

    class Meta:
        ordering = ['-reservation_date', '-reservation_time']

    def __str__(self):
        return f"{self.reference} - {self.customer_name} ({self.reservation_date} {self.reservation_time})"
