import json
from typing import Dict, Optional

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from ..models import Follow, User


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
    if is_self:
        follows = False
    else:
        follows = (
            Follow.objects.filter(follower=request.user, followee=user).count() > 0
        )
    return render(
        request,
        "network/profile.html",
        {
            "user_": user,
            "num_followers": followers_manager.all().count(),
            "num_followees": followees_manager.all().count(),
            "is_self": is_self,
            "follows": follows,
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
    """
    Follow/unfollow toggle
     - request method not PUT: 400
     - user not logged in    : 403
     - invalid parameter     : 400
     - nonexistent post      : 404
     - success               : 200
    """
    if request.method != "PUT":
        return JsonResponse(
            {
                "err": "Invalid request method.",
            },
            status=400,
        )
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(
            {
                "err": "You have to log in to like/unlike",
            },
            status=403,
        )
    data: Dict = json.loads(request.body)
    username: Optional[str] = data.get("username", None)
    status: Optional[bool] = data.get("status", None)
    if (
        None in (username, status)
        or not isinstance(username, str)
        or not isinstance(status, bool)
    ):
        return JsonResponse(
            {
                "err": "Empty message content.",
            },
            status=400,
        )
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"err": f"Unknown username {username}"}, status=404)
    if status:
        # Add new follow
        Follow.objects.get_or_create(follower=request.user, followee=user)
    else:
        # Remove existing follows
        Follow.objects.filter(follower=request.user, followee=user).delete()
    return JsonResponse(
        {
            "msg": "Success.",
        },
        status=200,
    )
