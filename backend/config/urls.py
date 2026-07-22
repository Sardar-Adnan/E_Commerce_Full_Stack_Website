"""
URL configuration for the Leaf & Bloom backend.

/admin/    -> Django Admin Panel (mandatory Admin Panel for this project)
/api/v1/   -> REST API consumed by the React customer website (built Day 2 onward)
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/', include('products.urls')),
    path('api/v1/', include('orders.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
