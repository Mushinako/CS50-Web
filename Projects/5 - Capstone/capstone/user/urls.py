from django.urls import path

from . import views

urlpatterns = [
    path("auth/login", views.auth.views.login_view, name="login-view"),
    path("auth/register", views.auth.views.register_view, name="register-view"),
    path("api/auth/login", views.auth.apis.login_api, name="login-api"),
    path("api/auth/logout", views.auth.apis.logout_api, name="logout-api"),
    path("api/auth/register", views.auth.apis.register_api, name="register-api"),
]
