from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'phone_number', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'is_staff', 'is_superuser']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'username', 'phone_number', 'password']
        extra_kwargs = {
            'email': {'validators': []},
            'username': {'validators': []},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('A user with this username already exists.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class AdminCustomerSerializer(serializers.ModelSerializer):
    """Serializer for admin customer list — includes order stats."""
    order_count = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'phone_number', 'date_joined', 'is_active', 'order_count', 'total_spent']
        read_only_fields = fields
