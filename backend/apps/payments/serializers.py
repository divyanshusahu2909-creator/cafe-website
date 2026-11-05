from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    order_reference = serializers.CharField(source='order.public_reference', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_reference', 'provider',
            'provider_payment_reference', 'amount', 'currency',
            'status', 'verified_at', 'created_at'
        ]

class DemoPaymentInputSerializer(serializers.Serializer):
    order_reference = serializers.CharField(max_length=60)
    simulate_failure = serializers.BooleanField(required=False, default=False)
