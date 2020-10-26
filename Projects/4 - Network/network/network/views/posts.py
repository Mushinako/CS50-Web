from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

from ..models import Post


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "network/index.html")


def new_post(request: HttpRequest) -> HttpResponse:
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
