from datetime import datetime

from django.contrib.auth.models import AbstractUser
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self) -> str:
        return f"{self.name}"


class User(AbstractUser):
    def __str__(self) -> str:
        return f"{self.username}"


class Listing(models.Model):
    active = models.BooleanField(default=True)
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=1024, blank=True)
    starting_bid = models.PositiveIntegerField()
    image_url = models.URLField(blank=True)
    categories = models.ManyToManyField(
        Category, related_name="listings", blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_time = models.DateTimeField(auto_now_add=True, blank=True)
    watched_by = models.ManyToManyField(
        User, related_name="watchlist", blank=True, through="Watch")

    def __str__(self) -> str:
        return f"{self.title}"

    def get_max_bid(self) -> str:
        bids: Bid.objects = self.bids
        max_amount = bids.aggregate(models.Max("amount"))["amount__max"]
        if max_amount is None:
            max_amount = self.starting_bid
        return f"{max_amount/100:,.2f}"

    def get_time_str(self) -> str:
        time: datetime = self.creation_time
        return time.strftime("%c")


class Watch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.user} is watching {self.listing}"


class Comment(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comments")
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="comments")
    message = models.CharField(max_length=1024)
    creation_time = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user} commented {self.message}"

    def get_time_str(self) -> str:
        time: datetime = self.creation_time
        return time.strftime("%c")


class Bid(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bids")
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="bids")
    amount = models.PositiveIntegerField()
    creation_time = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user} bid {self.amount} on {self.listing}"

    def get_time_str(self) -> str:
        time: datetime = self.creation_time
        return time.strftime("%c")
