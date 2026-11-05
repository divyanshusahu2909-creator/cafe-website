from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'name', 'rating', 'review_text',
            'is_approved', 'is_demo', 'created_at'
        ]
        read_only_fields = ['is_approved', 'is_demo', 'created_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

class AdminReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
