from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'display_order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['display_order', 'is_active']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'discounted_price', 'is_vegetarian', 'is_available', 'is_featured']
    list_filter = ['category', 'is_available', 'is_featured', 'is_vegetarian']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['price', 'discounted_price', 'is_available', 'is_featured']
