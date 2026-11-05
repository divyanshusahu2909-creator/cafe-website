from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'is_active', 'display_order', 'products_count',
            'created_at', 'updated_at'
        ]

    def get_products_count(self, obj):
        return obj.products.filter(is_available=True).count()

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    category_slug = serializers.ReadOnlyField(source='category.slug')
    effective_price = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'category_slug',
            'name', 'slug', 'description', 'price', 'discounted_price',
            'effective_price', 'image', 'is_vegetarian', 'is_available',
            'is_featured', 'preparation_time_minutes',
            'created_at', 'updated_at'
        ]
