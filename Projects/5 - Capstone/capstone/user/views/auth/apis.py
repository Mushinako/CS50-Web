from django.contrib.auth import authenticate, login, logout
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse


def login_api(req: HttpRequest) -> J:
    """
    Login form post handler
     - Method not POST: 400
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
    # Attempt to sign user in
    username = req.POST["username"]
    password = req.POST["password"]
    user = authenticate(req, username=username, password=password)
    # Check if authentication successful
    if user is not None:
        login(req, user)
        return JsonResponse(
            {"success": True, "msg": "Success", "next_": next_}, status=302
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
    """
    logout(req)
    return JsonResponse(
        {"success": True, "msg": "Success", "next_": reverse("lettershuffle:index")},
        status=302,
    )


def register_api(req: HttpRequest) -> HttpResponse:
    """
    Register form post handler
    """
