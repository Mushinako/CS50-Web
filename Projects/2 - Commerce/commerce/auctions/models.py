from datetime import datetime
from typing import Iterable, Optional

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self) -> str:
        return f"{self.name}"


class Listing(models.Model):
    active = models.BooleanField(default=True)
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=1024, blank=True)
    image_url = models.URLField(blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="listings", blank=True)
    creation_time = models.DateTimeField(default=timezone.now, blank=True)

    def __str__(self) -> str:
        return f"{self.title}"

    def get_max_bid(self) -> float:
        bids: Bid.objects = self.bids
        max_amount = bids.aggregate(models.Max("amount"))["amount__max"]
        return round(max_amount / 100, 2)


class User(AbstractUser):
    watchlist = models.ManyToManyField(
        Listing, related_name="watched_by", blank=True)

    def __str__(self) -> str:
        return f"{self.username}"


class Comment(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comments")
    message = models.CharField(max_length=1024)
    creation_time = models.DateTimeField(default=timezone.now, blank=True)

    def __str__(self) -> str:
        return f"{self.user} commented {self.message}"


class Bid(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bids")
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="bids")
    amount = models.PositiveIntegerField()
    creation_time = models.DateTimeField(default=timezone.now, blank=True)

    def __str__(self) -> str:
        return f"{self.user} bid {self.amount} on {self.listing}"
