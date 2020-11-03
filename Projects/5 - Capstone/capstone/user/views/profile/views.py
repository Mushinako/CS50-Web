from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def profile(req: HttpRequest) -> HttpResponse:
    """
    Render login page
    """
    return render(req, "profile/profile.html")
