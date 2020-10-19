from typing import Iterable, Optional
from django.contrib.auth.models import AbstractUser
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self) -> str:
        return f"{self.name}"


class Listing(models.Model):
    active = models.BooleanField(default=True)
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=1024)
    image_url = models.URLField(blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="listings", blank=True)

    def __str__(self) -> str:
        return f"{self.title}"


class User(AbstractUser):
    watchlist = models.ManyToManyField(
        Listing, related_name="watched_by", blank=True)

    def __str__(self) -> str:
        return f"{self.username}"


class Comment(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comments")
    message = models.CharField(max_length=1024)

    def __str__(self) -> str:
        return f"{self.user} commented {self.message}"


class Bid(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bids")
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="bids")
    amount = models.PositiveIntegerField()

    def __str__(self) -> str:
        return f"{self.user} bid {self.amount} on {self.listing}"
