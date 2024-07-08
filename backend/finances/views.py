from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import PayMethod, SplitMethod


class FinancesAPIView(APIView):
    def get(self, request):
        return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)


class PayMethods(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        pay_methods = PayMethod.objects.all()

        methods = []
        for method in pay_methods:
            methods.append({
                "id": method.id,
                "name": method.name,
            })

        return Response(methods, status=status.HTTP_200_OK)


class SplitMethods(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        split_methods = SplitMethod.objects.all()

        methods = []
        for method in split_methods:
            methods.append({
                "id": method.id,
                "name": method.name,
            })

        return Response(methods, status=status.HTTP_200_OK)
