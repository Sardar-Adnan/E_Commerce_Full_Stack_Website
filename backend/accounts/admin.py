from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin Panel access is controlled here: only users with is_staff=True can log
    into the Admin Panel at all; is_superuser=True grants full access.
    Regular customers (is_staff=False) exist in this same table but cannot log in here.
    """
    list_display = ('email', 'username', 'phone_number', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'phone_number', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    inlines = [AddressInline]

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'city', 'country', 'address_type', 'is_default')
    list_filter = ('address_type', 'is_default', 'country')
    search_fields = ('full_name', 'user__email', 'city', 'postal_code')
