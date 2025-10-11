from rest_framework.decorators import action
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Tweet
from .serializers import TweetSerializer

class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all().order_by('-timestamp')
    serializer_class = TweetSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['POST'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        tweet = self.get_object()
        tweet.likes += 1  # apenas incrementa
        tweet.save()
        return Response({"likes": tweet.likes}, status=status.HTTP_200_OK)


# from rest_framework import viewsets, permissions
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Tweet
# from .serializers import TweetSerializer

# class TweetViewSet(viewsets.ModelViewSet):
#     queryset = Tweet.objects.all().order_by('-timestamp')
#     serializer_class = TweetSerializer
#     permission_classes = [permissions.IsAuthenticated]  # Exige autenticação

#     def perform_create(self, serializer):
#         """
#         Associa o tweet ao usuário autenticado no momento da criação.
#         """
#         serializer.save(author=self.request.user)

#     def create(self, request, *args, **kwargs):
#         """
#         Retorna o tweet recém-criado no formato JSON.
#         """
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
