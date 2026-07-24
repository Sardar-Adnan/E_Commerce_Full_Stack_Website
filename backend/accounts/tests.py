from django.test import TestCase
from django.contrib.auth import get_user_model

from accounts.serializers import RegisterSerializer

User = get_user_model()


class RegisterSerializerValidationTests(TestCase):
    def test_duplicate_email_uses_custom_validation_message(self):
        User.objects.create_user(email='existing@example.com', username='existinguser', password='secret123')

        serializer = RegisterSerializer(data={
            'email': 'existing@example.com',
            'username': 'newuser',
            'phone_number': '1234567890',
            'password': 'newpass123',
        })

        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors['email'][0], 'A user with this email already exists.')

    def test_duplicate_username_uses_custom_validation_message(self):
        User.objects.create_user(email='user@example.com', username='takenname', password='secret123')

        serializer = RegisterSerializer(data={
            'email': 'new@example.com',
            'username': 'takenname',
            'phone_number': '1234567890',
            'password': 'newpass123',
        })

        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors['username'][0], 'A user with this username already exists.')
