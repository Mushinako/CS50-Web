from typing import Optional

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render


@login_required
def profile(request: HttpRequest, username: Optional[str] = None) -> HttpResponse:
    pass
