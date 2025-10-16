from rest_framework import serializers
from .models import Tweet
from .models import Tweet, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class TweetSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)  # <- aqui
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'username', 'userid', 'timestamp', 'likes', 'is_following',]

    def get_username(self, obj):
        return obj.author.email.split("@")[0]


class CommentSerializer(serializers.ModelSerializer):
    author_email = serializers.ReadOnlyField(source='author.email')

    class Meta:
        model = Comment
        fields = ['id', 'tweet', 'author', 'author_email', 'content', 'created_at']
        read_only_fields = ['author', 'author_email', 'created_at', 'tweet']

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'bio', 'avatar']

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance