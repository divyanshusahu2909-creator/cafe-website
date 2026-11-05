from django.db import models
from apps.core.models import TimeStampedModel

class Category(TimeStampedModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True, default='')
    image = models.CharField(max_length=500, blank=True, default='')
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(TimeStampedModel):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=180, unique=True)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=500, blank=True, default='')
    is_vegetarian = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    preparation_time_minutes = models.PositiveIntegerField(default=15, null=True, blank=True)

    class Meta:
        ordering = ['-is_featured', 'category__display_order', 'name']

    def __str__(self):
        return f"{self.name} (₹{self.price})"

    @property
    def effective_price(self):
        if self.discounted_price and self.discounted_price > 0:
            return self.discounted_price
        return self.price
