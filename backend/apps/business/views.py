from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.orders.models import Order, OrderItem
from apps.reservations.models import Reservation
from apps.orders.serializers import AdminOrderSerializer
from apps.reservations.serializers import AdminReservationSerializer
from .models import BusinessSettings
from .serializers import PublicBusinessSettingsSerializer, AdminBusinessSettingsSerializer

class PublicBusinessSettingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = BusinessSettings.get_settings()
        serializer = PublicBusinessSettingsSerializer(settings)
        return Response(serializer.data)

class AdminBusinessSettingsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        settings = BusinessSettings.get_settings()
        serializer = AdminBusinessSettingsSerializer(settings)
        return Response(serializer.data)

    def patch(self, request):
        settings = BusinessSettings.get_settings()
        serializer = AdminBusinessSettingsSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class AdminDashboardMetricsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        today = timezone.localdate()

        # Orders metrics
        total_orders = Order.objects.count()
        orders_today = Order.objects.filter(created_at__date=today).count()
        pending_orders = Order.objects.filter(order_status='pending').count()

        # Sales metrics (only paid orders contribute to real revenue calculation)
        total_sales = Order.objects.filter(payment_status='paid').aggregate(
            total=Sum('total')
        )['total'] or Decimal('0.00')

        # Reservations metrics
        pending_reservations = Reservation.objects.filter(status='pending').count()
        confirmed_reservations = Reservation.objects.filter(status='confirmed').count()

        # Popular products
        popular_items = (
            OrderItem.objects.values('product_name_snapshot')
            .annotate(order_count=Count('id'), total_qty=Sum('quantity'))
            .order_by('-total_qty')[:5]
        )

        # Recent records
        recent_orders = Order.objects.prefetch_related('items').all()[:5]
        recent_reservations = Reservation.objects.all()[:5]

        return Response({
            'metrics': {
                'total_orders': total_orders,
                'orders_today': orders_today,
                'pending_orders': pending_orders,
                'total_sales': str(total_sales),
                'pending_reservations': pending_reservations,
                'confirmed_reservations': confirmed_reservations,
            },
            'popular_products': list(popular_items),
            'recent_orders': AdminOrderSerializer(recent_orders, many=True).data,
            'recent_reservations': AdminReservationSerializer(recent_reservations, many=True).data,
        })
