from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.http import JsonResponse
from .models import Tweet
from .serializers import TweetSerializer

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all().order_by('-created_at')
    serializer_class = TweetSerializer
    permission_classes = [permissions.IsAuthenticated]  # Requer login

    def perform_create(self, serializer):
        """Associa o tweet ao usuário autenticado."""
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        """Cria e retorna o tweet recém-criado em JSON."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like_tweet(self, request, pk=None):
        """Toggle like/unlike de um tweet."""
        tweet = self.get_object()
        user = request.user

        if user in tweet.likes.all():
            tweet.likes.remove(user)
            liked = False
        else:
            tweet.likes.add(user)
            liked = True

        return JsonResponse({
            "liked": liked,
            "total_likes": tweet.likes.count()
        })
