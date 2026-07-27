from decimal import Decimal

from django.db import transaction
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Address
from products.models import Product, ProductVariant
from .models import Cart, CartItem, Order, OrderItem


class ProductSummarySerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'current_price', 'primary_image']

    def get_current_price(self, obj):
        return obj.current_price

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        return image.image.url if image and image.image else None


class ProductVariantSummarySerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'price']

    def get_price(self, obj):
        return obj.price


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSummarySerializer(read_only=True)
    variant = ProductVariantSummarySerializer(read_only=True)
    unit_price = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'variant', 'quantity', 'unit_price', 'subtotal']
        read_only_fields = ['id', 'product', 'variant', 'quantity', 'unit_price', 'subtotal']

    def get_unit_price(self, obj):
        return obj.unit_price

    def get_subtotal(self, obj):
        return obj.subtotal


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'updated_at']
        read_only_fields = ['id', 'items', 'total_items', 'total_price', 'updated_at']

    def get_total_items(self, obj):
        return obj.total_items

    def get_total_price(self, obj):
        return obj.total_price


class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, required=False, default=1)

    def validate(self, attrs):
        product = attrs['product_id']
        variant = attrs.get('variant_id')
        quantity = attrs.get('quantity', 1)

        if not product.is_active:
            raise serializers.ValidationError({'product_id': 'Product not available.'})

        if variant and variant.product_id != product.id:
            raise serializers.ValidationError({'variant_id': 'Variant does not belong to the selected product.'})

        available_stock = variant.stock_quantity if variant else product.stock_quantity
        if quantity > available_stock:
            raise serializers.ValidationError({'quantity': f'Only {available_stock} left in stock.'})

        return attrs


class CartItemUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)

    def validate_quantity(self, value):
        item = self.instance
        available_stock = item.variant.stock_quantity if item.variant else item.product.stock_quantity
        if value > available_stock:
            raise serializers.ValidationError(f'Only {available_stock} left in stock.')
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'variant_name', 'unit_price', 'quantity', 'subtotal']
        read_only_fields = fields

    def get_subtotal(self, obj):
        return obj.subtotal


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'payment_method', 'is_paid',
            'shipping_full_name', 'shipping_phone_number', 'shipping_street_address',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country',
            'subtotal', 'shipping_fee', 'total', 'notes', 'items', 'created_at'
        ]
        read_only_fields = fields


class CheckoutSerializer(serializers.Serializer):
    address_id = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all(), required=False, allow_null=True)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    street_address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices, required=False, default=Order.PaymentMethod.COD)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs.get('address_id') is None:
            required_inline_fields = ['full_name', 'phone_number', 'street_address', 'city', 'postal_code', 'country']
            missing = [field for field in required_inline_fields if not attrs.get(field)]
            if missing:
                raise serializers.ValidationError('Provide either address_id or full inline shipping details.')
        else:
            request = self.context.get('request')
            address = attrs['address_id']
            if request and address.user_id != request.user.id:
                raise serializers.ValidationError('Address does not belong to the requesting user.')

        return attrs


class AdminOrderSerializer(serializers.ModelSerializer):
    """Order serializer for admin views — includes customer email."""
    items = OrderItemSerializer(many=True, read_only=True)
    customer_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'customer_email', 'status', 'payment_method', 'is_paid',
            'shipping_full_name', 'shipping_phone_number', 'shipping_street_address',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country',
            'subtotal', 'shipping_fee', 'total', 'notes', 'items', 'created_at'
        ]
        read_only_fields = fields


class OrderStatusUpdateSerializer(serializers.Serializer):
    """Validates order status transitions for admin updates."""
    status = serializers.ChoiceField(choices=Order.Status.choices)

    def validate_status(self, value):
        instance = self.instance
        if instance and instance.status == Order.Status.CANCELLED:
            raise serializers.ValidationError('Cannot change status of a cancelled order.')
        if instance and instance.status == Order.Status.DELIVERED:
            raise serializers.ValidationError('Cannot change status of a delivered order.')
        return value
