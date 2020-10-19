from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def __str__(self) -> str:
        return f"{self.username}"


class Listing(models.Model):
    active = models.BooleanField()

    def __str__(self) -> str:
        return f"{self.id}: {self.active}"


class Bid(models.Model):
    def __str__(self) -> str:
        return f"{self.id}: {self}"


class Comment(models.Model):
    def __str__(self) -> str:
        return f"{self.id}: {self}"
