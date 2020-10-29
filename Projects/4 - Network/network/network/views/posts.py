import json
from datetime import datetime
from typing import Dict, List, Optional

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.http.response import HttpResponseRedirect
from django.shortcuts import render
from django.urls.base import reverse

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
        return JsonResponse(
            {
                "err": "Invalid request method.",
            },
            status=400,
        )
    start_time = request.GET.get("startTime", None)
    users = request.GET.get("users", None)
    query_args = {}
    if start_time is not None:
        try:
            query_args["creation_time__lt"] = datetime.fromisoformat(start_time)
        except ValueError:
            return JsonResponse(
                {
                    "err": f"{start_time} is not a valid timestamp",
                },
                status=400,
            )
    if users is not None:
        username_list = [u for u in users.split(",") if u]
        if not username_list:
            return JsonResponse(
                {
                    "err": f"{users} is not a valid array of usernames",
                },
                status=400,
            )
        users_list: List[User] = User.objects.filter(username__in=username_list)
        if not users_list:
            return JsonResponse(
                {
                    "err": f"{users} is not a valid array of usernames",
                },
                status=400,
            )
        query_args["author__in"] = users_list
    all_posts = Post.objects.filter(**query_args).order_by("-creation_time")
    posts = [post_json(post, request.user) for post in all_posts[:10]]
    more = len(all_posts) > 10
    return JsonResponse(
        {
            "posts": posts,
            "more": more,
            "loggedIn": request.user.is_authenticated,
        },
        status=200,
    )


@login_required
def edit_view(request: HttpRequest) -> HttpResponse:
    """
    Post edit view
     - request method not GET : 400
     - No post matching id_   : 400
    """
    if request.method != "GET":
        return JsonResponse(
            {
                "err": "Invalid request method.",
            },
            status=400,
        )
    id_ = request.GET.get("id_", None)
    if id_ is None:
        return render(request, "network/edit.html")
    else:
        try:
            post = Post.objects.get(id=id_)
        except Post.DoesNotExist:
            return JsonResponse({"err": f"{id_} is not a valid post id"}, status=400)
        return render(
            request,
            "network/edit.html",
            {
                "edit": True,
                "id_": id_,
                "content": post.content,
            },
        )


def edit_post(request: HttpRequest) -> JsonResponse:
    """
    New post reciever
     - request method not POST: 400
     - user not logged in     : 403
     - empty message content  : 400
     - success                : 200
    """
    if request.method != "POST":
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
                "err": "You have to log in to make a post.",
            },
            status=403,
        )
    content = request.POST.get("content", None)
    if not content:
        return JsonResponse(
            {
                "err": "Empty message content.",
            },
            status=400,
        )
    id_ = request.POST.get("post-id", None)
    if id_ is None:
        post = Post(author=user, content=content)
    else:
        try:
            post = Post.objects.get(id=id_)
        except Post.DoesNotExist:
            return JsonResponse({"err": f"{id_} is not a valid post id"}, status=400)
        post.content = content
    post.save()
    return HttpResponseRedirect(reverse("index"))


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
    post_id: Optional[int] = data.get("postId", None)
    status: Optional[bool] = data.get("status", None)
    if (
        None in (post_id, status)
        or not isinstance(post_id, int)
        or not isinstance(status, bool)
    ):
        return JsonResponse(
            {
                "err": "Empty message content.",
            },
            status=400,
        )
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"err": f"Unknown post ID {post_id}"}, status=404)
    if status:
        # Add new like
        Like.objects.get_or_create(user=user, post=post)
    else:
        # Remove existing likes
        Like.objects.filter(user=user, post=post).delete()
    return JsonResponse(
        {
            "msg": "Success.",
        },
        status=200,
    )
