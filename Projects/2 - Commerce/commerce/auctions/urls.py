from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("listing/<int:id_>", views.listing, name="listing"),
    path("category", views.categories, name="categories"),
    path("category/<str:category>", views.category, name="category"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new", views.new_listing, name="new"),
    path("comment", views.comment, name="comment"),
    path("watchlist", views.watch, name="watch"),
    path("bid", views.bid, name="bid"),
    path("close", views.close, name="close"),
]
