from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'provider', 'amount', 'currency', 'status', 'verified_at', 'created_at']
    list_filter = ['provider', 'status']
    search_fields = ['order__public_reference', 'provider_payment_reference']
