from decimal import Decimal

from django.db import transaction
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Address
from products.models import Product, ProductVariant
from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartItemCreateSerializer,
    CartItemSerializer,
    CartItemUpdateSerializer,
    CartSerializer,
    CheckoutSerializer,
    OrderSerializer,
)

FREE_SHIPPING_THRESHOLD = Decimal('3000')
SHIPPING_FEE_STANDARD = Decimal('200')


class CartAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request, *args, **kwargs):
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cart = Cart.objects.get_or_create(user=request.user)[0]
        serializer = CartItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data['product_id']
        variant = serializer.validated_data.get('variant_id')
        quantity = serializer.validated_data.get('quantity', 1)

        available_stock = variant.stock_quantity if variant else product.stock_quantity
        if quantity > available_stock:
            raise serializers.ValidationError({'quantity': f'Only {available_stock} left in stock.'})

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={'quantity': quantity},
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            available_stock = variant.stock_quantity if variant else product.stock_quantity
            if new_quantity > available_stock:
                raise serializers.ValidationError({'quantity': f'Only {available_stock} left in stock.'})
            cart_item.quantity = new_quantity
            cart_item.save(update_fields=['quantity'])
            return Response(CartItemSerializer(cart_item).data, status=status.HTTP_200_OK)

        cart_item.quantity = quantity
        cart_item.save(update_fields=['quantity'])
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)


class CartItemDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(CartItem.objects.select_related('cart', 'product', 'variant'), pk=pk, cart__user=user)

    def patch(self, request, pk, *args, **kwargs):
        item = self.get_object(pk, request.user)
        serializer = CartItemUpdateSerializer(instance=item, data=request.data)
        serializer.is_valid(raise_exception=True)

        item.quantity = serializer.validated_data['quantity']
        item.save(update_fields=['quantity'])
        return Response(CartItemSerializer(item).data)

    def delete(self, request, pk, *args, **kwargs):
        item = self.get_object(pk, request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartClearAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        cart = Cart.objects.get_or_create(user=request.user)[0]
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.select_related('user').prefetch_related(
        Prefetch('items', queryset=OrderItem.objects.order_by('id'))
    )
    serializer_class = OrderSerializer
    lookup_field = 'order_number'
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='checkout')
    def checkout(self, request, *args, **kwargs):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        cart = Cart.objects.get_or_create(user=request.user)[0]
        cart_items = list(cart.items.select_related('product', 'variant').all())
        if not cart_items:
            raise serializers.ValidationError({'cart': 'Your cart is empty.'})

        inventory_errors = []
        for item in cart_items:
            available_stock = item.variant.stock_quantity if item.variant else item.product.stock_quantity
            if item.quantity > available_stock:
                inventory_errors.append(
                    f"{item.product.name} only {available_stock} left in stock."
                )

        if inventory_errors:
            raise serializers.ValidationError({'stock': inventory_errors})

        shipping_data = serializer.validated_data
        address = shipping_data.get('address_id')
        if address:
            shipping_snapshot = {
                'shipping_full_name': address.full_name,
                'shipping_phone_number': address.phone_number,
                'shipping_street_address': address.street_address,
                'shipping_city': address.city,
                'shipping_state': address.state,
                'shipping_postal_code': address.postal_code,
                'shipping_country': address.country,
            }
        else:
            shipping_snapshot = {
                'shipping_full_name': shipping_data['full_name'],
                'shipping_phone_number': shipping_data['phone_number'],
                'shipping_street_address': shipping_data['street_address'],
                'shipping_city': shipping_data['city'],
                'shipping_state': shipping_data.get('state', ''),
                'shipping_postal_code': shipping_data['postal_code'],
                'shipping_country': shipping_data['country'],
            }

        with transaction.atomic():
            subtotal = sum((item.subtotal for item in cart_items), Decimal('0.00'))
            shipping_fee = SHIPPING_FEE_STANDARD if subtotal < FREE_SHIPPING_THRESHOLD else Decimal('0')
            total = subtotal + shipping_fee

            order = Order.objects.create(
                user=request.user,
                payment_method=shipping_data.get('payment_method', Order.PaymentMethod.COD),
                notes=shipping_data.get('notes', ''),
                status=Order.Status.PENDING,
                is_paid=False,
                subtotal=subtotal,
                shipping_fee=shipping_fee,
                total=total,
                **shipping_snapshot,
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    variant=item.variant,
                    product_name=item.product.name,
                    variant_name=item.variant.name if item.variant else '',
                    unit_price=item.unit_price,
                    quantity=item.quantity,
                )

                if item.variant:
                    item.variant.stock_quantity -= item.quantity
                    item.variant.save(update_fields=['stock_quantity'])
                else:
                    item.product.stock_quantity -= item.quantity
                    item.product.save(update_fields=['stock_quantity'])

            cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, order_number=None, *args, **kwargs):
        order = self.get_object()
        if order.status not in [Order.Status.PENDING, Order.Status.CONFIRMED]:
            raise serializers.ValidationError({'status': 'Only pending or confirmed orders can be cancelled.'})

        with transaction.atomic():
            for item in order.items.select_related('product', 'variant').all():
                if item.variant:
                    item.variant.stock_quantity += item.quantity
                    item.variant.save(update_fields=['stock_quantity'])
                elif item.product:
                    item.product.stock_quantity += item.quantity
                    item.product.save(update_fields=['stock_quantity'])

            order.status = Order.Status.CANCELLED
            order.save(update_fields=['status'])

        serializer = OrderSerializer(order)
        return Response(serializer.data)
