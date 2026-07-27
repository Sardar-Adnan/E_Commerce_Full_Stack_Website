"""
orders API routes
"""
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminOrderViewSet,
    CartAPIView,
    CartClearAPIView,
    CartItemCreateAPIView,
    CartItemDetailAPIView,
    OrderViewSet,
)

app_name = 'orders'

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

admin_router = DefaultRouter()
admin_router.register(r'admin/orders', AdminOrderViewSet, basename='admin-order')

urlpatterns = [
    path('cart/', CartAPIView.as_view(), name='cart'),
    path('cart/items/', CartItemCreateAPIView.as_view(), name='cart-item-create'),
    path('cart/items/<int:pk>/', CartItemDetailAPIView.as_view(), name='cart-item-detail'),
    path('cart/clear/', CartClearAPIView.as_view(), name='cart-clear'),
    *router.urls,
    *admin_router.urls,
]
