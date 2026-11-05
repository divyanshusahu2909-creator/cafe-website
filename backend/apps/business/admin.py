from django.contrib import admin
from .models import BusinessSettings

@admin.register(BusinessSettings)
class BusinessSettingsAdmin(admin.ModelAdmin):
    list_display = ['name', 'tagline', 'city', 'phone', 'whatsapp_number', 'delivery_available']
