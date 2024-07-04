from django.shortcuts import get_list_or_404, get_object_or_404, render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import *

# Create your views here.

class GroupAPIView(APIView):
    
    def get(self,request):
        user = request.user

        return Response()



class GroupCategory(APIView):
    parser_classes = []

    def get(self, request):
        categorys = get_list_or_404(category)
        
        category = []
        for i in categorys:
            category.append({ 
                "category_id": i.pk,
                "category_name": i.name
                })
        return Response(category,status=status.HTTP_200_OK)


class GroupDetail(APIView):
    parser_classes= [IsAuthenticated]

    def get(self,request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)
        group_ser ={
                "name": group.name,
                "category" : group.category.name,
                "currency": group.currency.currency,
                "created_at" :group.created_at,
                "edited_at" : group.edited_at
                }

        return Response(group_ser, status=status.HTTP_200_OK)


    def put(self, request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)
        
        name = request.data.get('name', group.name)
        category = request.data.get('category', group.category.name)
        currency = request.data.get('currency', group.currency.currency)

        group.name = name
        group.category.name = category
        group.currency.currency = currency
        group.save()

        return Response({
                "name": group.name,
                "category" : group.category.name,
                "currency": group.currency.currency,
                "created_at" :group.created_at,
                "edited_at" : group.edited_at
            })
        

    def delete(self, request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)

        group.delete()
        return Response({"message: 그룹을 삭제 했습니다."},status=status.HTTP_200_OK)