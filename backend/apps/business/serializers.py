from rest_framework import serializers
from .models import BusinessSettings

class PublicBusinessSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessSettings
        fields = [
            'name', 'tagline', 'description', 'city', 'state', 'country',
            'address_placeholder', 'phone', 'email', 'whatsapp_number',
            'opening_time', 'closing_time', 'opening_days',
            'delivery_available', 'delivery_fee', 'free_delivery_threshold',
            'currency', 'currency_symbol', 'google_maps_url', 'instagram_handle'
        ]

class AdminBusinessSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessSettings
        fields = '__all__'
