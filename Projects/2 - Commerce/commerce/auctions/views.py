from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.http.request import HttpRequest
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, Listing


def index(request: HttpRequest) -> HttpResponse:
    listings = Listing.objects.all()
    return render(request, "auctions/index.html", {
        "listings": listings,
    })


def login_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request) -> HttpResponse:
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


def listing(request: HttpRequest, id_: str) -> HttpResponse:
    """
    Listing details page
    """
    try:
        id_ = int(id_)
        lt = Listing.objects.get(id=id_)
    except (ValueError, Listing.DoesNotExist) as err:
        return _404(request, err)
    watching = False
    return render(request, "auctions/listing.html", {
        "lt": lt,
        "watching": watching,
    })


def watch_remove(request: HttpRequest) -> HttpResponse:
    """
    Remove item from watchlist
    """


def watch_add(request: HttpRequest) -> HttpResponse:
    """
    Add item to watchlist
    """


def _404(request: HttpRequest, exception=None) -> HttpResponse:
    return HttpResponseRedirect(reverse("index"))
