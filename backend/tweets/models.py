from django.db import models
from django.conf import settings

class Tweet(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Referência ao modelo de usuário
        on_delete=models.CASCADE,
        related_name="tweets"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.PositiveIntegerField(default=0)
    retweets = models.PositiveIntegerField(default=0)
    replies = models.PositiveIntegerField(default=0)

    @property
    def username(self):
        # Extrai a parte antes do "@" do e-mail do autor
        return self.author.email.split("@")[0]

    def __str__(self):
        return f"{self.username}: {self.content[:20]}"
