from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import TimeStampedModel


class User(AbstractUser, TimeStampedModel):
    """
    Custom user model for Leaf & Bloom.

    A single User model is used for both customers and staff/admins:
    - Regular customers: is_staff=False
    - Admin panel users: is_staff=True (and is_superuser=True for full access)

    This keeps auth simple while Django's built-in permission system
    (is_staff / is_superuser / groups / permissions) handles the Admin Panel access control.
    """
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)

    # Use email as the login identifier for the storefront, while keeping
    # `username` (auto-generated) so Django's admin/auth internals keep working smoothly.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Address(TimeStampedModel):
    """A saved shipping/billing address belonging to a customer."""

    class AddressType(models.TextChoices):
        SHIPPING = 'shipping', 'Shipping'
        BILLING = 'billing', 'Billing'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=AddressType.choices, default=AddressType.SHIPPING)
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='Pakistan')
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_default', '-created_at']
        verbose_name_plural = 'Addresses'

    def __str__(self):
        return f"{self.full_name} - {self.city}, {self.country}"
