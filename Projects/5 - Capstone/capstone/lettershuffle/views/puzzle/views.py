from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def welcome_view(req: HttpRequest) -> HttpResponse:
    """
    Render puzzle play page
    """
    return render(req, "lettershuffle/welcome.html")


def puzzle_view(req: HttpRequest) -> HttpResponse:
    """
    Render puzzle play page
    """
    return render(req, "lettershuffle/puzzle.html")
