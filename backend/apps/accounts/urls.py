from django.urls import path
from .views import (
    AdminLoginView,
    AdminLogoutView,
    AdminCurrentUserView,
    AdminCsrfTokenView,
)

urlpatterns = [
    path('auth/login/', AdminLoginView.as_view(), name='admin-login'),
    path('auth/logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('auth/me/', AdminCurrentUserView.as_view(), name='admin-me'),
    path('auth/csrf/', AdminCsrfTokenView.as_view(), name='admin-csrf'),
]
