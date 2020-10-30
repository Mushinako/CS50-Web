from django.urls import path

from . import views

urlpatterns = [
    path("api/auth/login", views.auth.login_api, name="login-api"),
    path("api/auth/logout", views.auth.logout_api, name="logout-api"),
    path("api/auth/register", views.auth.register_api, name="register-api"),
]
