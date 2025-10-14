from rest_framework import serializers
from .models import Tweet
from .models import Tweet, Comment

class TweetSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)  # <- aqui

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'username', 'timestamp', 'likes']

    def get_username(self, obj):
        return obj.author.email.split("@")[0]


class CommentSerializer(serializers.ModelSerializer):
    author_email = serializers.ReadOnlyField(source='author.email')

    class Meta:
        model = Comment
        fields = ['id', 'tweet', 'author', 'author_email', 'content', 'created_at']
        read_only_fields = ['author', 'author_email', 'created_at', 'tweet']