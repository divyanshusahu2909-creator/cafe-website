from django.contrib import admin
from .models import Coupon, Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_name_snapshot', 'unit_price_snapshot', 'quantity', 'line_total']

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'discount_value', 'minimum_order_amount', 'usage_count', 'usage_limit', 'is_active']
    list_filter = ['discount_type', 'is_active']
    search_fields = ['code']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['public_reference', 'customer_name', 'customer_phone', 'order_type', 'order_status', 'payment_status', 'total', 'created_at']
    list_filter = ['order_status', 'payment_status', 'order_type', 'created_at']
    search_fields = ['public_reference', 'customer_name', 'customer_phone', 'customer_email']
    inlines = [OrderItemInline]
