from django.contrib.auth import authenticate, login, logout
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse


def login_api(req: HttpRequest) -> HttpResponse:
    """
    Login form post handler
    """


def logout_api(req: HttpRequest) -> HttpResponse:
    """
    Logout post handler
    """


def register_api(req: HttpRequest) -> HttpResponse:
    """
    Register form post handler
    """
