from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from ..models import User


def login_view(request: HttpRequest) -> HttpResponse:
    next_ = request.GET.get("next", None)
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            next_ = request.GET.get("next", None)
            if next_ is None:
                return HttpResponseRedirect(reverse("index"))
            else:
                return HttpResponseRedirect(next_)
        else:
            return render(
                request,
                "network/login.html",
                {
                    "message": "Invalid username and/or password.",
                    "next_": next_,
                },
            )
    else:
        return render(
            request,
            "network/login.html",
            {
                "next_": next_,
            },
        )


def logout_view(request: HttpRequest) -> HttpResponse:
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request: HttpRequest) -> HttpResponse:
    next_ = request.GET.get("next", None)
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request,
                "network/register.html",
                {
                    "message": "Passwords must match.",
                    "next_": next_,
                },
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request,
                "network/register.html",
                {
                    "message": "Username already taken.",
                    "next_": next_,
                },
            )
        login(request, user)
        if next_ is None:
            return HttpResponseRedirect(reverse("index"))
        else:
            return HttpResponseRedirect(next_)
    else:
        return render(
            request,
            "network/register.html",
            {
                "next_": next_,
            },
        )
