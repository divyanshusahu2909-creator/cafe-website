from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from apps.core.utils import generate_order_reference
from apps.menu.models import Product
from .models import Coupon, Order, OrderItem

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'discount_type', 'discount_value',
            'minimum_order_amount', 'max_discount', 'start_date',
            'end_date', 'usage_limit', 'usage_count', 'is_active',
            'created_at', 'updated_at'
        ]

class CouponValidateInputSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.01'))

class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, max_value=50)

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name_snapshot',
            'unit_price_snapshot', 'quantity', 'line_total'
        ]

class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_phone = serializers.CharField(max_length=20)
    customer_email = serializers.EmailField(required=False, allow_blank=True, default='')
    order_type = serializers.ChoiceField(choices=Order.ORDER_TYPES)
    delivery_address = serializers.CharField(required=False, allow_blank=True, default='')
    customer_notes = serializers.CharField(required=False, allow_blank=True, default='')
    table_number = serializers.CharField(required=False, allow_blank=True, default='')
    coupon_code = serializers.CharField(required=False, allow_blank=True, default='')
    idempotency_key = serializers.CharField(required=False, allow_blank=True, default='')
    items = OrderItemInputSerializer(many=True)

    def validate(self, attrs):
        order_type = attrs.get('order_type')
        delivery_address = attrs.get('delivery_address', '').strip()
        if order_type == 'delivery' and not delivery_address:
            raise serializers.ValidationError({
                'delivery_address': 'Delivery address is required for delivery orders.'
            })

        items = attrs.get('items', [])
        if not items:
            raise serializers.ValidationError({'items': 'Order must contain at least one item.'})

        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        coupon_code = validated_data.get('coupon_code', '').strip().upper()
        order_type = validated_data.get('order_type')
        idempotency_key = validated_data.get('idempotency_key', '').strip()

        # Idempotency check: if key already exists, return existing order
        if idempotency_key:
            existing = Order.objects.filter(idempotency_key=idempotency_key).first()
            if existing:
                return existing

        with transaction.atomic():
            product_ids = [item['product_id'] for item in items_data]
            products = Product.objects.select_for_update().filter(id__in=product_ids)
            product_map = {p.id: p for p in products}

            missing_ids = set(product_ids) - set(product_map.keys())
            if missing_ids:
                raise serializers.ValidationError({
                    'items': f"Products with IDs {list(missing_ids)} do not exist."
                })

            subtotal = Decimal('0.00')
            prepared_items = []

            for item in items_data:
                product = product_map[item['product_id']]
                if not product.is_available:
                    raise serializers.ValidationError({
                        'items': f"'{product.name}' is currently unavailable."
                    })

                unit_price = product.effective_price
                qty = item['quantity']
                line_total = (unit_price * qty).quantize(Decimal('0.01'))
                subtotal += line_total

                prepared_items.append({
                    'product': product,
                    'product_name_snapshot': product.name,
                    'unit_price_snapshot': unit_price,
                    'quantity': qty,
                    'line_total': line_total,
                })

            # Calculate Coupon discount
            discount_amount = Decimal('0.00')
            applied_coupon = None
            if coupon_code:
                try:
                    applied_coupon = Coupon.objects.select_for_update().get(code__iexact=coupon_code)
                    is_valid, msg = applied_coupon.is_valid_for_subtotal(subtotal)
                    if is_valid:
                        discount_amount = applied_coupon.calculate_discount(subtotal)
                        applied_coupon.usage_count += 1
                        applied_coupon.save(update_fields=['usage_count'])
                    else:
                        raise serializers.ValidationError({'coupon_code': msg})
                except Coupon.DoesNotExist:
                    raise serializers.ValidationError({'coupon_code': 'Invalid coupon code.'})

            # Calculate Delivery Fee (flat ₹40 for delivery, ₹0 for dine-in/takeaway)
            delivery_fee = Decimal('40.00') if order_type == 'delivery' else Decimal('0.00')

            total = max(Decimal('0.00'), subtotal - discount_amount + delivery_fee).quantize(Decimal('0.01'))

            public_ref = generate_order_reference()

            order = Order.objects.create(
                public_reference=public_ref,
                customer_name=validated_data['customer_name'],
                customer_phone=validated_data['customer_phone'],
                customer_email=validated_data.get('customer_email', ''),
                order_type=order_type,
                order_status='pending',
                payment_status='pending',
                subtotal=subtotal,
                discount_amount=discount_amount,
                delivery_fee=delivery_fee,
                total=total,
                coupon_code=applied_coupon.code if applied_coupon else '',
                delivery_address=validated_data.get('delivery_address', ''),
                customer_notes=validated_data.get('customer_notes', ''),
                table_number=validated_data.get('table_number', ''),
                idempotency_key=idempotency_key,
            )

            for item_data in prepared_items:
                OrderItem.objects.create(
                    order=order,
                    product=item_data['product'],
                    product_name_snapshot=item_data['product_name_snapshot'],
                    unit_price_snapshot=item_data['unit_price_snapshot'],
                    quantity=item_data['quantity'],
                    line_total=item_data['line_total'],
                )

            return order

class OrderPublicDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'public_reference', 'order_type', 'order_status',
            'payment_status', 'subtotal', 'discount_amount',
            'delivery_fee', 'total', 'customer_name', 'customer_phone',
            'delivery_address', 'customer_notes', 'table_number',
            'items', 'created_at', 'updated_at'
        ]

class AdminOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class AdminOrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_status', 'payment_status']
