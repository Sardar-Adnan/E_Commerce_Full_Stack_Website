from django.contrib import admin
from django.utils.html import format_html
from .models import Cart, CartItem, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'variant', 'product_name', 'variant_name', 'unit_price', 'quantity', 'subtotal_display')
    can_delete = False

    @admin.display(description='Subtotal')
    def subtotal_display(self, obj):
        return f"Rs. {obj.subtotal}"


STATUS_COLORS = {
    'pending': '#f0ad4e',
    'confirmed': '#5bc0de',
    'processing': '#5bc0de',
    'shipped': '#337ab7',
    'delivered': '#5cb85c',
    'cancelled': '#d9534f',
}


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    This is the primary order-management interface for the Admin Panel:
    staff can view every order, filter by status, and update status
    (e.g. mark Shipped / Delivered / Cancelled) directly from the list or detail view.
    """
    list_display = (
        'order_number', 'user', 'colored_status', 'payment_method', 'is_paid',
        'total', 'item_count', 'created_at',
    )
    list_filter = ('status', 'payment_method', 'is_paid', 'created_at')
    search_fields = ('order_number', 'user__email', 'shipping_full_name', 'shipping_phone_number')
    readonly_fields = (
        'order_number', 'user', 'subtotal', 'shipping_fee', 'total',
        'created_at', 'updated_at',
    )
    list_editable = ('is_paid',)
    inlines = [OrderItemInline]
    actions = ['mark_as_confirmed', 'mark_as_processing', 'mark_as_shipped', 'mark_as_delivered', 'mark_as_cancelled']

    fieldsets = (
        ('Order Info', {'fields': ('order_number', 'user', 'status', 'payment_method', 'is_paid', 'notes')}),
        ('Shipping Details', {'fields': (
            'shipping_full_name', 'shipping_phone_number', 'shipping_street_address',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country',
        )}),
        ('Amounts', {'fields': ('subtotal', 'shipping_fee', 'total')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    @admin.display(description='Status')
    def colored_status(self, obj):
        color = STATUS_COLORS.get(obj.status, '#777')
        return format_html(
            '<span style="background:{};color:#fff;padding:3px 10px;border-radius:10px;font-size:12px;">{}</span>',
            color, obj.get_status_display(),
        )

    @admin.display(description='Items')
    def item_count(self, obj):
        return obj.items.count()

    def _bulk_set_status(self, request, queryset, status, label):
        updated = queryset.update(status=status)
        self.message_user(request, f"{updated} order(s) marked as {label}.")

    @admin.action(description='Mark selected orders as Confirmed')
    def mark_as_confirmed(self, request, queryset):
        self._bulk_set_status(request, queryset, Order.Status.CONFIRMED, 'Confirmed')

    @admin.action(description='Mark selected orders as Processing')
    def mark_as_processing(self, request, queryset):
        self._bulk_set_status(request, queryset, Order.Status.PROCESSING, 'Processing')

    @admin.action(description='Mark selected orders as Shipped')
    def mark_as_shipped(self, request, queryset):
        self._bulk_set_status(request, queryset, Order.Status.SHIPPED, 'Shipped')

    @admin.action(description='Mark selected orders as Delivered')
    def mark_as_delivered(self, request, queryset):
        self._bulk_set_status(request, queryset, Order.Status.DELIVERED, 'Delivered')

    @admin.action(description='Mark selected orders as Cancelled')
    def mark_as_cancelled(self, request, queryset):
        self._bulk_set_status(request, queryset, Order.Status.CANCELLED, 'Cancelled')


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('product', 'variant', 'quantity')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Read-only visibility into active customer carts (useful for support / abandoned-cart insight)."""
    list_display = ('user', 'total_items', 'total_price', 'updated_at')
    search_fields = ('user__email',)
    inlines = [CartItemInline]
    readonly_fields = ('user',)
