from rest_framework import serializers

from .models import Category, Product, ProductImage, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']
        read_only_fields = ['id']


class ProductVariantSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'price_override', 'price', 'stock_quantity', 'sku_suffix']
        read_only_fields = ['id', 'price']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
        write_only=True,
    )
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'category',
            'category_id',
            'name',
            'slug',
            'description',
            'care_instructions',
            'light_requirement',
            'is_pet_safe',
            'base_price',
            'discount_price',
            'current_price',
            'sku',
            'stock_quantity',
            'is_active',
            'is_featured',
            'in_stock',
            'images',
            'variants',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'current_price', 'in_stock', 'created_at', 'updated_at']

    def validate(self, attrs):
        instance = self.instance
        base_price = attrs.get('base_price', instance.base_price if instance else None)
        discount_price = attrs.get('discount_price', instance.discount_price if instance else None)

        if base_price is not None and discount_price is not None and discount_price >= base_price:
            raise serializers.ValidationError({
                'discount_price': 'Discount price must be lower than base price.'
            })

        return attrs
