from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, Product

class MenuAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Hot Coffee",
            slug="hot-coffee",
            description="Fresh espresso brews",
            display_order=1,
            is_active=True
        )
        self.product = Product.objects.create(
            category=self.category,
            name="Aesthetic Signature Latte",
            slug="aesthetic-signature-latte",
            description="Gold dust latte",
            price=Decimal("199.00"),
            discounted_price=Decimal("179.00"),
            is_vegetarian=True,
            is_available=True,
            is_featured=True
        )

    def test_category_list(self):
        url = reverse('category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'hot-coffee')

    def test_product_list(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        item = response.data['results'][0]
        self.assertEqual(item['name'], 'Aesthetic Signature Latte')
        self.assertEqual(item['effective_price'], '179.00')

    def test_product_detail_by_slug(self):
        url = reverse('product-detail', kwargs={'slug': 'aesthetic-signature-latte'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Aesthetic Signature Latte')

    def test_featured_products(self):
        url = reverse('featured-products')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data[0]['is_featured'])
