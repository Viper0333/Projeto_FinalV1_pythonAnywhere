from django.urls import path, include
# from rest_framework.routers import DefaultRouter
from rest_framework import routers
from .views import TweetViewSet

# router = DefaultRouter()
router = routers.SimpleRouter()
router.register(r'tweets', TweetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]