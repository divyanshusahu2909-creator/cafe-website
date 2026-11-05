from django.urls import path
from .views import (
    OrderCreateView,
    OrderPublicDetailView,
    OrderCancelView,
    CouponValidateView,
    PublicOffersView,
)

urlpatterns = [
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders/<str:public_reference>/', OrderPublicDetailView.as_view(), name='order-public-detail'),
    path('orders/<str:public_reference>/cancel/', OrderCancelView.as_view(), name='order-cancel'),
    path('coupons/validate/', CouponValidateView.as_view(), name='coupon-validate'),
    path('offers/', PublicOffersView.as_view(), name='public-offers'),
]
