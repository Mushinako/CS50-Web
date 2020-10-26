from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField(
        "self", symmetrical=False, through="Follow", blank=True)

    def __str__(self) -> str:
        return f"{self.username}"


class Post(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="posts")
    content = models.CharField(max_length=280)
    liked_by = models.ManyToManyField(
        User, related_name="likes", through="Like", blank=True)
    time = models.DateTimeField(auto_now=True)

    def get_num_likes(self) -> int:
        likes: Like.objects = self.liked_by
        num_likes = likes.all().count()
        return num_likes

    def __str__(self) -> str:
        return f"{self.content} posted by {self.author} at {self.time}"


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.user} liked {self.post}"


class Follow(models.Model):
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="follows")
    followee = models.ForeignKey(User, on_delete=models.CASCADE)
