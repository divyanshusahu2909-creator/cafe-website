from decimal import Decimal
from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from django.db.models import Q
from .models import Coupon, Order
from .serializers import (
    CouponSerializer,
    CouponValidateInputSerializer,
    OrderCreateSerializer,
    OrderPublicDetailSerializer,
    AdminOrderSerializer,
    AdminOrderStatusUpdateSerializer,
)

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        output_serializer = OrderPublicDetailSerializer(order)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

class OrderPublicDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.prefetch_related('items').all()
    serializer_class = OrderPublicDetailSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'lookup'
    lookup_field = 'public_reference'

class OrderCancelView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'lookup'

    def post(self, request, public_reference):
        try:
            order = Order.objects.get(public_reference=public_reference)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if order.order_status not in ('pending', 'confirmed'):
            return Response(
                {'detail': f"Cannot cancel an order in '{order.order_status}' status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.order_status = 'cancelled'
        order.save(update_fields=['order_status', 'updated_at'])
        return Response(OrderPublicDetailSerializer(order).data, status=status.HTTP_200_OK)

class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CouponValidateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data['code'].strip().upper()
        subtotal = serializer.validated_data['subtotal']

        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'message': 'Invalid coupon code.'}, status=status.HTTP_404_NOT_FOUND)

        is_valid, msg = coupon.is_valid_for_subtotal(subtotal)
        if not is_valid:
            return Response({'valid': False, 'message': msg}, status=status.HTTP_400_BAD_REQUEST)

        discount = coupon.calculate_discount(subtotal)
        return Response({
            'valid': True,
            'code': coupon.code,
            'discount_type': coupon.discount_type,
            'discount_value': str(coupon.discount_value),
            'discount_amount': str(discount),
            'message': 'Coupon applied successfully!'
        }, status=status.HTTP_200_OK)

class PublicOffersView(generics.ListAPIView):
    serializer_class = CouponSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Coupon.objects.filter(is_active=True).order_by('-created_at')

# Admin Views
class AdminOrderListView(generics.ListAPIView):
    serializer_class = AdminOrderSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Order.objects.prefetch_related('items').all()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(order_status=status_param)

        order_type = self.request.query_params.get('type')
        if order_type:
            queryset = queryset.filter(order_type=order_type)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(public_reference__icontains=search) |
                Q(customer_name__icontains=search) |
                Q(customer_phone__icontains=search)
            )

        return queryset

class AdminOrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.prefetch_related('items').all()
    serializer_class = AdminOrderSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminOrderStatusUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = AdminOrderStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminCouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all().order_by('-created_at')
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]
