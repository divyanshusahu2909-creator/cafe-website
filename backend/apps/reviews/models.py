from django.db import models
from apps.core.models import TimeStampedModel

class Review(TimeStampedModel):
    name = models.CharField(max_length=120)
    rating = models.PositiveSmallIntegerField(default=5)
    review_text = models.TextField()
    is_approved = models.BooleanField(default=False)
    is_demo = models.BooleanField(default=False, help_text="Designates seeded sample demo reviews")

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.rating}★ ({'Demo' if self.is_demo else 'Customer'})"
