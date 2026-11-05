from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from django.db.models import Q
from .models import CafeTable, Reservation
from .serializers import (
    CafeTableSerializer,
    ReservationCreateSerializer,
    ReservationPublicDetailSerializer,
    AdminReservationSerializer,
    AdminReservationStatusUpdateSerializer,
)

class ReservationCreateView(generics.CreateAPIView):
    serializer_class = ReservationCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reservation = serializer.save()
        output_serializer = ReservationPublicDetailSerializer(reservation)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

class ReservationPublicDetailView(generics.RetrieveAPIView):
    queryset = Reservation.objects.select_related('table').all()
    serializer_class = ReservationPublicDetailSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'lookup'
    lookup_field = 'reference'

class ReservationCancelView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'lookup'

    def post(self, request, reference):
        try:
            reservation = Reservation.objects.get(reference=reference)
        except Reservation.DoesNotExist:
            return Response({'detail': 'Reservation not found.'}, status=status.HTTP_404_NOT_FOUND)

        if reservation.status not in ('pending', 'confirmed'):
            return Response(
                {'detail': f"Cannot cancel a reservation in '{reservation.status}' status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        reservation.status = 'cancelled'
        reservation.save(update_fields=['status', 'updated_at'])
        return Response(ReservationPublicDetailSerializer(reservation).data, status=status.HTTP_200_OK)

# Admin Views
class AdminReservationListView(generics.ListAPIView):
    serializer_class = AdminReservationSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Reservation.objects.select_related('table').all()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        date_param = self.request.query_params.get('date')
        if date_param:
            queryset = queryset.filter(reservation_date=date_param)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(reference__icontains=search) |
                Q(customer_name__icontains=search) |
                Q(customer_phone__icontains=search)
            )

        return queryset

class AdminReservationDetailView(generics.RetrieveAPIView):
    queryset = Reservation.objects.select_related('table').all()
    serializer_class = AdminReservationSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminReservationStatusUpdateView(generics.UpdateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = AdminReservationStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminCafeTableViewSet(viewsets.ModelViewSet):
    queryset = CafeTable.objects.all().order_by('table_number')
    serializer_class = CafeTableSerializer
    permission_classes = [permissions.IsAdminUser]
