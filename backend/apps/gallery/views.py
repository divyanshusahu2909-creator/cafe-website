from rest_framework import generics, viewsets, permissions
from .models import GalleryImage
from .serializers import GalleryImageSerializer, AdminGalleryImageSerializer

class GalleryListView(generics.ListAPIView):
    serializer_class = GalleryImageSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return GalleryImage.objects.filter(is_active=True).order_by('display_order', '-created_at')

class AdminGalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all().order_by('display_order', '-created_at')
    serializer_class = AdminGalleryImageSerializer
    permission_classes = [permissions.IsAdminUser]
