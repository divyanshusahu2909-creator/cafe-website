from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.orders.models import Order
from .serializers import DemoPaymentInputSerializer, PaymentSerializer
from .services import DemoPaymentProvider, RazorpayPaymentProvider, PaymentError

class DemoPaymentProcessView(APIView):
    """
    Process simulated demo payment for local testing and portfolio showcases.
    Always includes disclaimer: "Demo payment — no real money will be charged."
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = DemoPaymentInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ref = serializer.validated_data['order_reference'].strip()
        simulate_failure = serializer.validated_data.get('simulate_failure', False)

        try:
            order = Order.objects.get(public_reference=ref)
        except Order.DoesNotExist:
            return Response({'detail': f"Order '{ref}' not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.payment_status == 'paid':
            return Response({
                'detail': 'Order is already marked as paid.',
                'order_reference': order.public_reference,
                'status': 'paid'
            }, status=status.HTTP_400_BAD_REQUEST)

        provider = DemoPaymentProvider()
        result = provider.process_payment(order, simulate_failure=simulate_failure)

        http_status = status.HTTP_200_OK if result['success'] else status.HTTP_400_BAD_REQUEST
        return Response(result, status=http_status)

class GatewayCreateOrderView(APIView):
    """
    Boundary for external Razorpay integration.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        provider = RazorpayPaymentProvider()
        if not provider.is_configured():
            return Response({
                'configured': False,
                'message': (
                    "Razorpay integration is currently unconfigured. "
                    "For local testing, please use the Demo Payment option "
                    "(POST /api/v1/payments/demo/)."
                )
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({'configured': True, 'message': 'Ready for gateway'}, status=status.HTTP_200_OK)
