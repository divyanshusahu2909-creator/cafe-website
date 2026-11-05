from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from apps.menu.views import AdminCategoryViewSet, AdminProductViewSet
from apps.orders.views import (
    AdminOrderListView,
    AdminOrderDetailView,
    AdminOrderStatusUpdateView,
    AdminCouponViewSet,
)
from apps.reservations.views import (
    AdminReservationListView,
    AdminReservationDetailView,
    AdminReservationStatusUpdateView,
    AdminCafeTableViewSet,
)
from apps.gallery.views import AdminGalleryImageViewSet
from apps.reviews.views import AdminReviewViewSet

# Admin Routers
admin_router = DefaultRouter()
admin_router.register(r'products', AdminProductViewSet, basename='admin-products')
admin_router.register(r'categories', AdminCategoryViewSet, basename='admin-categories')
admin_router.register(r'coupons', AdminCouponViewSet, basename='admin-coupons')
admin_router.register(r'tables', AdminCafeTableViewSet, basename='admin-tables')
admin_router.register(r'gallery', AdminGalleryImageViewSet, basename='admin-gallery')
admin_router.register(r'reviews', AdminReviewViewSet, basename='admin-reviews')

api_v1_patterns = [
    # Auth
    path('', include('apps.accounts.urls')),

    # Public Modules
    path('', include('apps.menu.urls')),
    path('', include('apps.orders.urls')),
    path('', include('apps.reservations.urls')),
    path('', include('apps.payments.urls')),
    path('', include('apps.reviews.urls')),
    path('', include('apps.gallery.urls')),
    path('', include('apps.business.urls')),

    # Admin Dedicated Views
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/orders/<int:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin/orders/<int:pk>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-order-status-update'),

    path('admin/reservations/', AdminReservationListView.as_view(), name='admin-reservation-list'),
    path('admin/reservations/<int:pk>/', AdminReservationDetailView.as_view(), name='admin-reservation-detail'),
    path('admin/reservations/<int:pk>/status/', AdminReservationStatusUpdateView.as_view(), name='admin-reservation-status-update'),

    # Admin CRUD Viewsets
    path('admin/', include(admin_router.urls)),
]

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/v1/', include(api_v1_patterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
