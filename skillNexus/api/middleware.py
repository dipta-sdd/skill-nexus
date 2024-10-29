# middleware.py
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user = AnonymousUser()
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            try:
                token = auth_header.split(' ')[1]
                refresh = RefreshToken(token)
                user = JWTAuthentication().get_user(refresh)
                request.user = user
            except TokenError:
                request.user = None

        response = self.get_response(request)
        return response
