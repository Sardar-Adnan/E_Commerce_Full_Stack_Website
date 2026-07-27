from django.contrib.auth import get_user_model
from django.db.models import Count, Sum, Q, DecimalField
from django.db.models.functions import Coalesce
from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .serializers import AdminCustomerSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    'message': 'User registered successfully.',
                    'user': UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class AdminCustomerListView(generics.ListAPIView):
    """Admin-only view to list all customers with order statistics."""
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdminCustomerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'username', 'phone_number']
    ordering_fields = ['date_joined', 'email', 'order_count', 'total_spent']
    ordering = ['-date_joined']

    def get_queryset(self):
        return User.objects.filter(is_staff=False).annotate(
            order_count=Count('orders'),
            total_spent=Coalesce(Sum('orders__total'), 0, output_field=DecimalField(max_digits=12, decimal_places=2)),
        )
