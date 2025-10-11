from rest_framework import status, generics, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.generics import RetrieveUpdateAPIView
from .serializers import UserCreateSerializer, UserSerializer, UserUpdateSerializer, MyTokenObtainPairSerializer

User = get_user_model()

# ===============================
# Signup
# ===============================
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        print(f"Usuário criado: {user.email}")
        return Response({"id": user.id}, status=status.HTTP_201_CREATED)
    else:
        print(f"Erros no formulário: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# Perfil do usuário (edição e visualização)
# ===============================
class UserProfileView(RetrieveUpdateAPIView):
    """
    Endpoint para o usuário visualizar e editar seu próprio perfil.
    GET → retorna os dados do usuário
    PUT/PATCH → atualiza o usuário
    """
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ===============================
# ViewSet de usuários
# ===============================
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return super().get_serializer_class()


# ===============================
# Login JWT via email
# ===============================
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError({"detail": "Email e senha são obrigatórios."})

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError({"detail": "Credenciais inválidas."})

        data = super().validate(attrs)
        data['user'] = UserSerializer(user).data
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
