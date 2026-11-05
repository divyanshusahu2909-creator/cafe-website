from rest_framework import generics, viewsets, permissions, filters
from django.db.models import Q
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by('display_order', 'name')

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.select_related('category').filter(
            category__is_active=True,
            is_available=True
        )

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(Q(category__slug=category) | Q(category__id=category))

        featured = self.request.query_params.get('featured')
        if featured is not None:
            is_featured = featured.lower() in ('true', '1')
            queryset = queryset.filter(is_featured=is_featured)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )

        sort_by = self.request.query_params.get('sort')
        if sort_by == 'price_asc':
            queryset = queryset.order_by('price')
        elif sort_by == 'price_desc':
            queryset = queryset.order_by('-price')
        elif sort_by == 'name':
            queryset = queryset.order_by('name')

        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Product.objects.select_related('category').filter(
            is_featured=True,
            is_available=True,
            category__is_active=True
        )[:8]

# Admin Views
class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('display_order', 'name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'created_at', 'name', 'is_available', 'is_featured']
