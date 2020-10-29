from typing import Optional

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from ..models import Post, User


@login_required
def profile(request: HttpRequest, username: Optional[str] = None) -> HttpResponse:
    if username == request.user.username:
        return HttpResponseRedirect(reverse("profile"))
    is_self = username is None
    if is_self:
        user: User = request.user
    else:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return render(
                request,
                "network/profile.html",
                {
                    "err": f"No user with username {username} exists.",
                },
            )
    followers_manager: User.objects = user.followers
    followees_manager: User.objects = user.followees
    return render(
        request,
        "network/profile.html",
        {
            "user_": user,
            "num_followers": followers_manager.all().count(),
            "num_followees": followees_manager.all().count(),
            "is_self": is_self,
        },
    )


@login_required
def following(request: HttpRequest) -> HttpResponse:
    user = request.user
    followees_manager: User.objects = user.followees
    followee_names = [u.username for u in followees_manager.all()]
    return render(
        request,
        "network/following.html",
        {
            "followees": followee_names,
        },
    )


def follow(request: HttpRequest) -> JsonResponse:
    pass