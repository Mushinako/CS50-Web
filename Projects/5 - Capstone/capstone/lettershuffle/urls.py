from django.urls import path

from . import views

urlpatterns = [
    path("", views.puzzle.views.puzzle_view, name="puzzle-view"),
    path(
        "api/lettershuffle/puzzle",
        views.puzzle.apis.puzzle_get_api,
        name="puzzle-get-api",
    ),
    path(
        "api/lettershuffle/puzzlecheck",
        views.puzzle.apis.puzzle_check_api,
        name="puzzle-check-api",
    ),
    path(
        "api/lettershuffle/puzzlenew",
        views.puzzle.apis.puzzle_new_api,
        name="puzzle-new-api",
    ),
]
