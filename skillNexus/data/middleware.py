from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import login


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check for the JWT token in the cookie
        token = request.COOKIES.get('token')
        if token:
            try:
                # Authenticate the token
                jwt_auth = JWTAuthentication()
                user, _ = jwt_auth.authenticate(request)

                # Log the user in using Django's authentication system
                if user:
                    login(request, user)
            except Exception as e:
                # Handle token authentication errors
                print(f"JWT authentication error: {e}")
                pass

        response = self.get_response(request)
        return response
