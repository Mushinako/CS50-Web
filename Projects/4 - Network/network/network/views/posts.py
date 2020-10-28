import json
from datetime import datetime
from typing import Dict, List, Optional

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render

from ..models import Like, Post, User


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "network/index.html")


def post_json(post: Post, user: User) -> Dict:
    if user.is_authenticated:
        try:
            Like.objects.get(user=user, post=post)
        except Like.DoesNotExist:
            liked = False
        else:
            liked = True
    else:
        liked = False
    return {
        "id": post.id,
        "username": post.author.username,
        "content": post.content,
        "creationTime": str(post.creation_time),
        "editTime": str(post.last_edit_time) if post.is_edited else None,
        "liked": liked,
        "likeCount": post.get_num_likes(),
    }


def get_post(request: HttpRequest) -> JsonResponse:
    """
    Send posts info
     - request method not GET: 400
     - request format error  : 400
     - invalid date          : 400
     - success               : 200
    """
    if request.method != "GET":
        return JsonResponse({
            "err": "Invalid request method.",
        }, status=400)
    start_time = request.GET.get("startTime", None)
    users = request.GET.get("users", None)
    query_args = {}
    if start_time is not None:
        # Change `now`
        query_args["creation_time__lt"] = datetime.now()
    if users is not None:
        try:
            users_list: List[str] = json.loads(users)
        except json.JSONDecodeError:
            return JsonResponse({
                "err": f"{users} is not a valid array of usernames",
            }, status=400)
        if not isinstance(users_list, list) or not all(isinstance(u, str) for u in users_list):
            return JsonResponse({
                "err": f"{users} is not a valid array of usernames",
            }, status=400)
        query_args["username__in"] = users
    all_posts = Post.objects.filter(**query_args).order_by("-creation_time")
    posts = [post_json(post, request.user) for post in all_posts[:10]]
    more = len(all_posts) > 10
    return JsonResponse({
        "posts": posts,
        "more": more,
        "loggedIn": request.user.is_authenticated,
    }, status=200)


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
            "err": "Invalid request method.",
        }, status=400)
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            "err": "You have to log in to make a post.",
        }, status=403)
    content = request.POST.get("content", None)
    if not content:
        return JsonResponse({
            "err": "Empty message content.",
        }, status=400)
    post = Post(author=user, content=content)
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
     - nonexistent post      : 404
     - success               : 200
    """
    if request.method != "PUT":
        return JsonResponse({
            "err": "Invalid request method.",
        }, status=400)
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            "err": "You have to log in to like/unlike",
        }, status=403)
    data: Dict[str, int] = json.loads(request.body)
    post_id: Optional[int] = data.get("postId", None)
    status: Optional[bool] = data.get("status", None)
    checks = (post_id, status)
    if None in checks or not all(isinstance(c, int) for c in checks):
        return JsonResponse({
            "err": "Empty message content.",
        }, status=400)
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({
            "err": f"Unknown post ID {post_id}"
        }, status=404)
    if status:
        # Add new like
        same_likes_count = Like.objects.filter(user=user, post=post).count()
        if not same_likes_count:
            like = Like(user=user, post=post)
            like.save()
    else:
        # Remove existing likes
        Like.objects.filter(user=user, post=post).delete()
    return JsonResponse({
        "msg": "Success.",
    }, status=200)
