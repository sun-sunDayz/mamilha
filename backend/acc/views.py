from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from . import permissions

User = get_user_model()
# Create your views here.

class AccAPIView(APIView):
    permission_classes = [permissions.AccVIEWPermission]
    def get(self, request):
        return Response({
            "username": request.user.username,
        })
    def post(self, request):
        return Response({"message": "POST method"})
    def put(self, request):
        return Response({"message": "PUT method"})
    def delete(self, request):
        return Response({"message": "DELETE method"})

