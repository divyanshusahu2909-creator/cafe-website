from django.urls import path
from .views import (
    ReservationCreateView,
    ReservationPublicDetailView,
    ReservationCancelView,
)

urlpatterns = [
    path('reservations/', ReservationCreateView.as_view(), name='reservation-create'),
    path('reservations/<str:reference>/', ReservationPublicDetailView.as_view(), name='reservation-public-detail'),
    path('reservations/<str:reference>/cancel/', ReservationCancelView.as_view(), name='reservation-cancel'),
]
