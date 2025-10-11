from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserViewSet, signup, MyTokenObtainPairView, UserProfileView
from .views import UserProfileView

# Router para o ViewSet de usuários
router = routers.SimpleRouter()
router.register('', UserViewSet, basename='user')  # /api/users/

urlpatterns = [
    # Endpoint para cadastro
    path('signup/', signup, name='signup'),  # /api/users/signup/
    
    # Endpoints para autenticação JWT
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Endpoint para editar perfil (PATCH / PUT)
    path('profile/', UserProfileView.as_view(), name='profile'),

    path('profile/view/', UserProfileView.as_view(), name='user-profile'),

    # Inclui as rotas do router (UserViewSet)
    path('', include(router.urls)),

    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
