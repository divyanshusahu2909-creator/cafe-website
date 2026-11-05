from django.db import models
from apps.core.models import TimeStampedModel

class GalleryImage(TimeStampedModel):
    image = models.CharField(max_length=500)
    caption = models.CharField(max_length=200, blank=True, default='')
    alt_text = models.CharField(max_length=200, default='Aesthetic Aroma Cafe Experience')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.caption or f"Gallery Image #{self.id}"
