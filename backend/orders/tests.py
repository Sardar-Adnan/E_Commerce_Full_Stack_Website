from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import Address
from products.models import Category, Product, ProductVariant
from orders.models import Cart, CartItem, Order

User = get_user_model()


class CartAndCheckoutAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='buyer@example.com', username='buyer', password='secret123')
        self.other_user = User.objects.create_user(email='other@example.com', username='other', password='secret123')

        self.category = Category.objects.create(name='Indoor Plants', slug='indoor-plants')
        self.product = Product.objects.create(
            category=self.category,
            name='Monstera Deliciosa',
            slug='monstera-deliciosa',
            description='A test product',
            base_price='1000.00',
            discount_price='900.00',
            sku='MONSTERA-API-001',
            stock_quantity=5,
            is_active=True,
            is_featured=True,
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            name='Large',
            price_override='1200.00',
            stock_quantity=3,
            sku_suffix='L',
        )
        self.address = Address.objects.create(
            user=self.user,
            address_type='shipping',
            full_name='Buyer User',
            phone_number='1234567890',
            street_address='123 Test Street',
            city='Karachi',
            state='Sindh',
            postal_code='75200',
            country='Pakistan',
            is_default=True,
        )

    def test_get_cart_auto_creates_empty_cart(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/v1/cart/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total_items'], 0)
        self.assertEqual(Cart.objects.filter(user=self.user).count(), 1)

    def test_add_same_product_twice_increments_quantity_without_duplicate_row(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/v1/cart/items/', {'product_id': self.product.id, 'quantity': 1}, format='json')
        self.assertEqual(response.status_code, 201)

        response = self.client.post('/api/v1/cart/items/', {'product_id': self.product.id, 'quantity': 2}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(CartItem.objects.filter(cart__user=self.user, product=self.product).count(), 1)
        self.assertEqual(CartItem.objects.get(cart__user=self.user, product=self.product).quantity, 3)

    def test_checkout_with_empty_cart_returns_400(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/v1/orders/checkout/', {'address_id': self.address.id}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['success'], False)

    def test_checkout_creates_order_and_decrements_stock(self):
        self.client.force_authenticate(user=self.user)
        self.client.post('/api/v1/cart/items/', {'product_id': self.product.id, 'quantity': 2}, format='json')

        response = self.client.post('/api/v1/orders/checkout/', {'address_id': self.address.id}, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Order.objects.filter(user=self.user).count(), 1)
        self.assertEqual(CartItem.objects.filter(cart__user=self.user).count(), 0)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 3)
