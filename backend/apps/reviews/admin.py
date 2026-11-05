from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['name', 'rating', 'is_approved', 'is_demo', 'created_at']
    list_filter = ['is_approved', 'is_demo', 'rating']
    search_fields = ['name', 'review_text']
    list_editable = ['is_approved']
