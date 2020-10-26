import json
from typing import Dict

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

from ..models import Post


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "network/index.html")


def new_post(request: HttpRequest) -> JsonResponse:
    """
    New post reciever
     - request method not POST: 400
     - user not logged in     : 403
     - empty message content  : 400
     - success                : 200
    """
    if request.method != "POST":
        return JsonResponse({
            "msg": "Invalid request method.",
        }, status=400)
    if not request.user.is_authenticated:
        return JsonResponse({
            "msg": "You have to log in to make a post.",
        }, status=403)
    content = request.POST.get("content", None)
    if not content:
        return JsonResponse({
            "msg": "Empty message content.",
        }, status=400)
    post = Post(author=request.user, content=content)
    post.save()
    return JsonResponse({
        "msg": "Success.",
    }, status=200)


def like_unlike(request: HttpRequest) -> JsonResponse:
    """
    Like/unlike toggle
     - request method not PUT: 400
     - user not logged in    : 403
     - invalid parameter     : 400
     - success               : 200
    """
    if request.method != "PUT":
        return JsonResponse({
            "msg": "Invalid request method.",
        }, status=400)
    if not request.user.is_authenticated:
        return JsonResponse({
            "msg": "You have to log in to like/unlike",
        }, status=403)
    data: Dict[str, int] = json.loads(request.body)
    post_id = data.get("postId", None)
    status = data.get("status", None)
    checks = (post_id, status)
    if None in checks or not all(isinstance(c, int) for c in checks):
        return JsonResponse({
            "msg": "Empty message content.",
        }, status=400)
    if status:
        # Add new like
        pass
    else:
        # Remove existing likes
        pass
