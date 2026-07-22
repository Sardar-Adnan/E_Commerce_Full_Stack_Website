from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductVariant, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'product_count', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

    @admin.display(description='# Products')
    def product_count(self, obj):
        return obj.products.count()


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'thumbnail', 'name', 'category', 'sku', 'base_price', 'discount_price',
        'stock_status', 'is_active', 'is_featured',
    )
    list_filter = ('category', 'is_active', 'is_featured', 'light_requirement', 'is_pet_safe')
    search_fields = ('name', 'sku', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductVariantInline, ProductImageInline]
    list_editable = ('is_active', 'is_featured')
    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ('Basic Info', {'fields': ('category', 'name', 'slug', 'sku', 'description')}),
        ('Plant Care Details', {'fields': ('care_instructions', 'light_requirement', 'is_pet_safe')}),
        ('Pricing & Stock', {'fields': ('base_price', 'discount_price', 'stock_quantity')}),
        ('Visibility', {'fields': ('is_active', 'is_featured')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    @admin.display(description='Stock')
    def stock_status(self, obj):
        if obj.stock_quantity == 0:
            color, label = 'red', 'Out of stock'
        elif obj.stock_quantity < 10:
            color, label = 'orange', f'Low ({obj.stock_quantity})'
        else:
            color, label = 'green', f'In stock ({obj.stock_quantity})'
        return format_html('<b style="color:{}">{}</b>', color, label)

    @admin.display(description='Image')
    def thumbnail(self, obj):
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        if primary:
            return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', primary.image.url)
        return "—"
