from django.test import TestCase
from rest_framework.test import APIClient

from products.models import Category, Product
from products.serializers import ProductSerializer


class ProductSerializerValidationTests(TestCase):
    def test_discount_price_must_be_less_than_base_price(self):
        category = Category.objects.create(name='Indoor Plants', slug='indoor-plants')

        serializer = ProductSerializer(data={
            'category_id': category.id,
            'name': 'Monstera',
            'description': 'A test product',
            'care_instructions': 'Keep in indirect light',
            'light_requirement': 'bright',
            'is_pet_safe': True,
            'base_price': '1000.00',
            'discount_price': '1500.00',
            'sku': 'MONSTERA-001',
            'stock_quantity': 10,
            'is_active': True,
            'is_featured': True,
        })

        self.assertFalse(serializer.is_valid())
        self.assertIn('discount_price', serializer.errors)

    def test_partial_update_rejects_discount_price_above_existing_base_price(self):
        category = Category.objects.create(name='Indoor Plants', slug='indoor-plants')
        product = Product.objects.create(
            category=category,
            name='Monstera',
            slug='monstera',
            description='A test product',
            base_price='1000.00',
            discount_price='900.00',
            sku='MONSTERA-001',
            stock_quantity=10,
            is_active=True,
            is_featured=True,
        )

        serializer = ProductSerializer(instance=product, data={'discount_price': '1500.00'}, partial=True)

        self.assertFalse(serializer.is_valid())
        self.assertIn('discount_price', serializer.errors)

    def test_partial_update_rejects_base_price_below_existing_discount_price(self):
        category = Category.objects.create(name='Indoor Plants', slug='indoor-plants')
        product = Product.objects.create(
            category=category,
            name='Monstera',
            slug='monstera-2',
            description='A test product',
            base_price='1000.00',
            discount_price='900.00',
            sku='MONSTERA-002',
            stock_quantity=10,
            is_active=True,
            is_featured=True,
        )

        serializer = ProductSerializer(instance=product, data={'base_price': '800.00'}, partial=True)

        self.assertFalse(serializer.is_valid())
        self.assertIn('discount_price', serializer.errors)


class ProductSlugLookupTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Indoor Plants', slug='indoor-plants')
        self.product = Product.objects.create(
            category=self.category,
            name='Monstera Deliciosa',
            slug='monstera-deliciosa',
            description='A test plant',
            base_price='1000.00',
            discount_price='900.00',
            sku='MONSTERA-001',
            stock_quantity=5,
            is_active=True,
            is_featured=True,
        )

    def test_product_detail_can_be_retrieved_by_slug(self):
        response = self.client.get(f'/api/v1/products/{self.product.slug}/')
        self.assertEqual(response.status_code, 200)
