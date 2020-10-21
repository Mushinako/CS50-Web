from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("listing/<str:id_>", views.listing, name="listing"),
    path("watchlist", views.watch, name="watch"),
    re_path(r"^category(?:/(?P<category>.+))?$",
            views.category, name="category"),
    path("bid", views.bid, name="bid"),
    path("close", views.close, name="close"),
]
