from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("auth/login", views.login_view, name="login"),
    path("auth/logout", views.logout_view, name="logout"),
    path("auth/register", views.register, name="register"),
    path("posts/edit/post", views.edit_post, name="edit-post"),
    path("posts/edit", views.edit_view, name="edit-view"),
    path("posts", views.get_post, name="get-post"),
    path("like", views.like_unlike, name="like"),
    path("users/follow", views.follow, name="follow"),
    path("users/profile", views.profile, name="profile"),
    re_path(r"^users/profile(?:/(?P<username>[^/]+))?$", views.profile, name="profile"),
    path("users/following", views.following, name="following"),
]
