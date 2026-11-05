from rest_framework import generics, viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer, AdminReviewSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Review.objects.filter(is_approved=True).order_by('-created_at')[:10]

    def perform_create(self, serializer):
        # Customer submitted reviews require admin approval before being public
        serializer.save(is_approved=False, is_demo=False)

class AdminReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = AdminReviewSerializer
    permission_classes = [permissions.IsAdminUser]
