from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailBackend(ModelBackend):
    """
    Permite login usando email e senha.
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        if email is None or password is None:
            return None
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None





# from django.test import TestCase
# from rest_framework.test import APIClient
# from rest_framework import status
# from users.models import User


# class UserAPITest(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         # Cria usuário usando apenas email e password
#         self.user = User.objects.create_user(
#             email="testuser@example.com",
#             password="password123"
#         )
#         # Agora, na rota de token, { "email": ..., "password": ... }
#         response = self.client.post('/api/token/', {
#             "email": "testuser@example.com",
#             "password": "password123"
#         })
#         self.token = response.json().get("access")
#         self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

#     def test_get_users(self):
#         """Usuário autenticado deve conseguir GET /api/users/ com 200 OK."""
#         response = self.client.get('/api/users/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_create_user(self):
#         """Criando um novo usuário via POST /api/users/"""
#         data = {
#             "email": "newuser@example.com",
#             "password": "newpassword123",
#             "password_confirmation": "newpassword123",  # Campo obrigatório
#         }
#         response = self.client.post('/api/users/', data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
