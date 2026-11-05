import datetime
from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum
from rest_framework import serializers
from apps.core.utils import generate_reservation_reference
from .models import CafeTable, Reservation

OPENING_TIME = datetime.time(10, 0)
CLOSING_TIME = datetime.time(22, 30)

class CafeTableSerializer(serializers.ModelSerializer):
    location_display = serializers.CharField(source='get_location_display', read_only=True)

    class Meta:
        model = CafeTable
        fields = ['id', 'table_number', 'capacity', 'location', 'location_display', 'is_active']

class ReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = [
            'customer_name', 'customer_phone', 'customer_email',
            'reservation_date', 'reservation_time', 'guest_count',
            'special_requests'
        ]

    def validate_reservation_date(self, value):
        today = timezone.localdate()
        if value < today:
            raise serializers.ValidationError("Reservation date cannot be in the past.")
        max_horizon = today + datetime.timedelta(days=60)
        if value > max_horizon:
            raise serializers.ValidationError("Bookings are only accepted up to 60 days in advance.")
        return value

    def validate_reservation_time(self, value):
        if value < OPENING_TIME or value > CLOSING_TIME:
            raise serializers.ValidationError(
                f"Reservations are only available between {OPENING_TIME.strftime('%I:%M %p')} and {CLOSING_TIME.strftime('%I:%M %p')}."
            )
        return value

    def validate_guest_count(self, value):
        if value < 1 or value > 12:
            raise serializers.ValidationError("Guest count must be between 1 and 12.")
        return value

    def validate(self, attrs):
        res_date = attrs.get('reservation_date')
        res_time = attrs.get('reservation_time')
        guest_count = attrs.get('guest_count', 2)

        # Check total cafe capacity
        total_capacity = CafeTable.objects.filter(is_active=True).aggregate(
            total=Sum('capacity')
        )['total'] or 30

        # Check existing confirmed/pending bookings within +/- 1 hour
        time_low = (datetime.datetime.combine(datetime.date.today(), res_time) - datetime.timedelta(minutes=59)).time()
        time_high = (datetime.datetime.combine(datetime.date.today(), res_time) + datetime.timedelta(minutes=59)).time()

        booked_guests = Reservation.objects.filter(
            reservation_date=res_date,
            reservation_time__gte=time_low,
            reservation_time__lte=time_high,
            status__in=['pending', 'confirmed']
        ).aggregate(total=Sum('guest_count'))['total'] or 0

        if booked_guests + guest_count > total_capacity:
            raise serializers.ValidationError(
                "We are fully booked for this time slot. Please choose an alternate time or date."
            )

        return attrs

    def create(self, validated_data):
        reference = generate_reservation_reference()
        return Reservation.objects.create(
            reference=reference,
            status='pending',
            **validated_data
        )

class ReservationPublicDetailSerializer(serializers.ModelSerializer):
    table_number = serializers.CharField(source='table.table_number', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'reference', 'customer_name', 'customer_phone',
            'customer_email', 'reservation_date', 'reservation_time',
            'guest_count', 'status', 'special_requests',
            'table_number', 'created_at', 'updated_at'
        ]

class AdminReservationSerializer(serializers.ModelSerializer):
    table_details = CafeTableSerializer(source='table', read_only=True)

    class Meta:
        model = Reservation
        fields = '__all__'

class AdminReservationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['status', 'table', 'admin_notes']
