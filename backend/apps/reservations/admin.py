from django.contrib import admin
from .models import CafeTable, Reservation

@admin.register(CafeTable)
class CafeTableAdmin(admin.ModelAdmin):
    list_display = ['table_number', 'capacity', 'location', 'is_active']
    list_filter = ['location', 'is_active']

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['reference', 'customer_name', 'customer_phone', 'reservation_date', 'reservation_time', 'guest_count', 'status', 'table']
    list_filter = ['status', 'reservation_date']
    search_fields = ['reference', 'customer_name', 'customer_phone']
