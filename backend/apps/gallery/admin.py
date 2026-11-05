from django.contrib import admin
from .models import GalleryImage

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['caption', 'alt_text', 'display_order', 'is_active']
    list_editable = ['display_order', 'is_active']
