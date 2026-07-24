from django.db import models
from django.utils.text import slugify
from core.models import TimeStampedModel


class Category(TimeStampedModel):
    """Product category, e.g. Indoor Plants, Planters & Pots, Soil & Fertilizers."""

    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(TimeStampedModel):
    """A sellable product, e.g. 'Monstera Deliciosa'."""

    class LightRequirement(models.TextChoices):
        LOW = 'low', 'Low Light'
        MEDIUM = 'medium', 'Medium Light'
        BRIGHT = 'bright', 'Bright Indirect Light'
        DIRECT = 'direct', 'Direct Sunlight'

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    care_instructions = models.TextField(blank=True, help_text="Watering, light, pet-safety notes, etc.")
    light_requirement = models.CharField(
        max_length=10, choices=LightRequirement.choices, blank=True
    )
    is_pet_safe = models.BooleanField(default=False)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sku = models.CharField(max_length=64, unique=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active', 'is_featured']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def current_price(self):
        if self.discount_price and self.discount_price < self.base_price:
            return self.discount_price
        return self.base_price

    @property
    def in_stock(self):
        return self.stock_quantity > 0

    def __str__(self):
        return self.name


class ProductVariant(TimeStampedModel):
    """
    Optional size/pot variant of a product, e.g. 'Small (4in pot)' vs 'Large (10in pot)'.
    Each variant can override price and has its own stock tracking.
    """

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100, help_text="e.g. Small, Medium, Large")
    price_override = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    sku_suffix = models.CharField(max_length=32, blank=True)

    class Meta:
        unique_together = ('product', 'name')
        ordering = ['id']

    @property
    def price(self):
        return self.price_override if self.price_override else self.product.current_price

    def __str__(self):
        return f"{self.product.name} - {self.name}"


class ProductImage(TimeStampedModel):
    """Additional gallery images for a product (first/primary + extras)."""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=150, blank=True)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_primary', 'id']

    def __str__(self):
        return f"Image for {self.product.name}"
