from rest_framework import serializers
from .models import Tweet

class TweetSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)  # <- aqui

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'username', 'timestamp', 'likes']

    def get_username(self, obj):
        return obj.author.email.split("@")[0]
