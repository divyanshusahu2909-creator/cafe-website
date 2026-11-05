from django.urls import path
from .views import DemoPaymentProcessView, GatewayCreateOrderView

urlpatterns = [
    path('payments/demo/', DemoPaymentProcessView.as_view(), name='payment-demo'),
    path('payments/create-order/', GatewayCreateOrderView.as_view(), name='payment-gateway-order'),
]
