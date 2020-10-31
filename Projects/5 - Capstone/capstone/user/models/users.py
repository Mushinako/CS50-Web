from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

# Create your models here.
class User(AbstractUser):
    """
    User model

    Additional fields:
    """

    accessed = models.ManyToManyField(
        "lettershuffle.Puzzle", related_name="accessed_by", through="Access", blank=True
    )
    solved = models.ManyToManyField(
        "lettershuffle.Puzzle", related_name="solved_by", through="Attempt", blank=True
    )


class Access(models.Model):
    """"""

    accessor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="access_stats"
    )
    problem = models.ForeignKey(
        "lettershuffle.Puzzle", on_delete=models.CASCADE, related_name="access_stats"
    )
    access_time = models.DateTimeField(editable=False)

    def save(self, *args, **kwargs) -> None:
        """"""
        self.access_time = timezone.now()
        return super().save(*args, **kwargs)


class Attempt(models.Model):
    """"""

    solver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="solve_stats"
    )
    problem = models.ForeignKey(
        "lettershuffle.Puzzle", on_delete=models.CASCADE, related_name="solve_stats"
    )
    time = models.PositiveIntegerField()
    try_num = models.PositiveIntegerField()
    solved = models.BooleanField(default=False)
