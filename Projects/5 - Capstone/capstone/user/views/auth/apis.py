from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.urls import reverse

from ...models.users import User


def login_api(req: HttpRequest) -> JsonResponse:
    """
    Login form post handler
     - Method not POST     : 400
     - Authenticate failure: 403
     - Authenticate success: 302
    """
    if req.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "msg": f"Expected request method: POST ; got {req.method}",
            },
            status=400,
        )
    next_ = req.GET.get("next", None)
    if next_ is None:
        next_ = reverse("lettershuffle:index")
    # Attempt to sign user in
    username = req.POST["username"]
    password = req.POST["password"]
    user = authenticate(req, username=username, password=password)
    # Check if authentication successful
    if user is not None:
        login(req, user)
        return JsonResponse(
            {
                "success": True,
                "msg": "Success",
                "next_": next_,
            },
            status=302,
        )
    else:
        return JsonResponse(
            {
                "success": False,
                "msg": "Invalid username and/or password.",
                "next_": next_,
            },
            status=403,
        )


def logout_api(req: HttpRequest) -> JsonResponse:
    """
    Logout post handler
     - Method not POST: 400
     - Logout success : 302
    """
    if req.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "msg": f"Expected request method: POST ; got {req.method}",
            },
            status=400,
        )
    next_ = req.GET.get("next", None)
    if next_ is None:
        next_ = reverse("lettershuffle:index")
    logout(req)
    return JsonResponse(
        {
            "success": True,
            "msg": "Success",
            "next_": next_,
        },
        status=302,
    )


def register_api(req: HttpRequest) -> HttpResponse:
    """
    Register form post handler
     - Method not POST       : 400
     - Confirmation not match: 400
    """
    if req.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "msg": f"Expected request method: POST ; got {req.method}",
            },
            status=400,
        )
    next_ = req.GET.get("next", None)
    if next_ is None:
        next_ = reverse("lettershuffle:index")
    next_ = reverse("lettershuffle:index")
    username = req.POST["username"]
    email = req.POST["email"]

    # Ensure password matches confirmation
    password = req.POST["password"]
    confirmation = req.POST["confirmation"]
    if password != confirmation:
        return JsonResponse(
            {
                "success": False,
                "msg": "Password does not match confirmation",
            },
            status=400,
        )

    # Attempt to create new user
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return JsonResponse(
            {
                "success": False,
                "message": "Username already taken",
            },
            status=400,
        )
    login(req, user)
    return JsonResponse(
        {
            "success": True,
            "msg": "Success",
            "next_": next_,
        },
        status=302,
    )
