from django.contrib.auth.backends import ModelBackend
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model


class YourCustomBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Django admin authentication
        user = super().authenticate(request, username=username, password=password, **kwargs)
        if user is None:
            # JWT authentication
            try:
                token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
                refresh = RefreshToken(token)
                user = refresh.get_user()
            except Exception as e:
                print(e)
                pass

        return user
