# users/urls.py
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserViewSet, signup, MyTokenObtainPairView
from .views import profile
from .views import toggle_follow


router = routers.SimpleRouter()
router.register('', UserViewSet, basename='users') 

urlpatterns = [
    path('signup/', signup, name='signup'), 
    path('profile/', profile, name='profile'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('follow/<int:user_id>/', toggle_follow, name='toggle_follow'), 
    path('', include(router.urls)),
]
