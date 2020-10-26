from typing import Optional

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

from ..models import User


@login_required
def profile(request: HttpRequest, username: Optional[str] = None) -> HttpResponse:
    is_self = username is None
    if is_self:
        user = request.user
    else:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return render(request, "network/profile.html", {
                "err": f"No user with username {username} exists.",
            })
    return render(request, "network/profile.html", {
        "user_": user,
        "is_self": is_self,
    })


@login_required
def following(request: HttpRequest) -> HttpResponse:
    pass
