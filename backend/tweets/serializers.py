from rest_framework import serializers
from .models import Tweet

class TweetSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'username', 'timestamp', 'likes', 'retweets', 'replies']

    def get_username(self, obj):
        return obj.author.email.split("@")[0]
