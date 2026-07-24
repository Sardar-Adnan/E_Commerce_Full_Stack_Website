from django.db.models import Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from .models import Category, Product, ProductImage, ProductVariant
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related(
        Prefetch('images', queryset=ProductImage.objects.order_by('-is_primary', 'id')),
        Prefetch('variants', queryset=ProductVariant.objects.order_by('id')),
    ).order_by('-created_at')
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category': ['exact'],
        'is_active': ['exact'],
        'is_featured': ['exact'],
        'is_pet_safe': ['exact'],
        'light_requirement': ['exact'],
        'base_price': ['gte', 'lte'],
    }
    search_fields = ['name', 'description', 'sku', 'category__name']
    ordering_fields = ['created_at', 'base_price', 'name']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
