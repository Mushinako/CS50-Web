from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    followees = models.ManyToManyField(
        "self",
        related_name="followers",
        symmetrical=False,
        through="Follow",
        through_fields=("follower", "followee"),
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.username}"


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.CharField(max_length=280)
    liked_by = models.ManyToManyField(
        User, related_name="likes", through="Like", blank=True
    )
    creation_time = models.DateTimeField(editable=False)
    is_edited = models.BooleanField(default=False)
    last_edit_time = models.DateTimeField()

    def get_num_likes(self) -> int:
        likes: Like.objects = self.liked_by
        num_likes = likes.all().count()
        return num_likes

    def save(self, *args, **kwargs) -> None:
        if self.id:
            self.is_edited = True
        else:
            self.creation_time = timezone.now()
        self.last_edit_time = timezone.now()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.content} posted by {self.author} at {self.creation_time}"


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.user} liked {self.post}"


class Follow(models.Model):
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followee"
    )
    followee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="follower"
    )

    def __str__(self) -> str:
        return f"{self.follower} follows {self.followee}"
