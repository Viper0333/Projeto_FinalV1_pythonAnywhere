# users/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, UserCreateSerializer, MyTokenObtainPairSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserUpdateSerializer

User = get_user_model()


# -------------------------------
# UserViewSet: lista/detalha usuários
# -------------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]  # apenas usuários autenticados

    def get_permissions(self):
        if self.action == "create":  # criar usuário
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated]  # resto exige login

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        """Endpoint para seguir/desseguir outro usuário"""
        user_to_follow = self.get_object()
        user = request.user

        if user == user_to_follow:
            return Response(
                {"detail": "Você não pode seguir a si mesmo."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user_to_follow.followers.filter(id=user.id).exists():
            user_to_follow.followers.remove(user)
            return Response({"status": "unfollowed"}, status=status.HTTP_200_OK)
        else:
            user_to_follow.followers.add(user)
            return Response({"status": "followed"}, status=status.HTTP_200_OK)

# -------------------------------
# Signup endpoint: cria um usuário
# -------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {'id': user.id, 'email': user.email},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
# JWT Token endpoint
# -------------------------------
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# -------------------------------
# Profile endpoint separado, fora do ViewSet
# -------------------------------
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    """GET para ver perfil e PATCH para atualizar perfil do usuário"""
    user = request.user

    if request.method == 'GET':
        serializer = UserUpdateSerializer(user)
        return Response(serializer.data)

    if request.method == 'PATCH':
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

