
from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts/new", views.new_post, name="new-post"),
    path("posts", views.get_post, name="get-post"),
    path("like", views.like_unlike, name="like"),
    re_path(r"^profile(?:/(?P<username>[^/]+))?$",
            views.profile, name="profile"),
    path("profile", views.profile, name="profile"),
    path("following", views.following, name="following"),
]
