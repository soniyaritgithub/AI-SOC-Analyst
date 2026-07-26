from accounts.api.views import (ChangePasswordAPIView, ForgotPasswordAPIView,
                                LoginAPIView, LogoutAPIView, ProfileAPIView,
                                RefreshTokenAPIView, RegisterAPIView)
from accounts.api.views.reset_password import ResetPasswordAPIView
from django.urls import path

urlpatterns = [
    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),
    path(
        "login/",
        LoginAPIView.as_view(),
        name="login",
    ),
    path(
    "refresh/",
    RefreshTokenAPIView.as_view(),
    name="token_refresh",
    ),
    path(
    "logout/",
    LogoutAPIView.as_view(),
    name="logout",
    ),
    path(
    "me/",
    ProfileAPIView.as_view(),
    name="profile",
    ),
    path(
    "change-password/",
    ChangePasswordAPIView.as_view(),
    name="change_password",
    ),
    path(
    "forgot-password/",
    ForgotPasswordAPIView.as_view(),
    name="forgot_password",
    ),
    
    path(
        "reset-password/",
        ResetPasswordAPIView.as_view(),
        name="reset-password",
    ),
]