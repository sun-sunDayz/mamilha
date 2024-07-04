from django.shortcuts import get_list_or_404, get_object_or_404, render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import *

# Create your views here.


def validate_group_data(name, category_name, currency_name):
     #이름이 빈값일 경우 Error처리
    if not name:
        return Response({'error': "그룹 이름이 없습니다"},
                        status=status.HTTP_400_BAD_REQUEST)
    #카테고리가 빈값일 경우 Error처리
    if not category_name:
        return Response({'error': "그룹 카테고리를 선택해 주세요"},
                        status=status.HTTP_400_BAD_REQUEST)
    #통화가 빈값일 경우 Error처리
    if not currency_name:
        return Response({'error': "그룹 통화를 선택해 주세요"},
                        status=status.HTTP_400_BAD_REQUEST)
    #없는 카테고리, 통화 선택시 error처리
    try:
        category = Group_category.objects.get(name=category_name)
        currency = Currency.objects.get(currency=currency_name)
    except category.DoesNotExist:
        return Response({'error': "없는 카테고리입니다"},
                        status=status.HTTP_400_BAD_REQUEST)
    except currency.DoesNotExist:
        return Response({'error': "없는 통화입니다"},
                        status=status.HTTP_400_BAD_REQUEST)
    
    return{
        "name" : name,
        "category" : category,
        "currency": currency
    }


class GroupAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        user = request.user
        groups_list = user.Member_user.all()
        
        groups =[]
        for i in groups_list:
            groups.append({
                "name": i.group.name,
                "category" : i.group.category.name,
                "currency": i.group.currency.currency,
                })

        return Response(groups,
                        status=status.HTTP_200_OK)
    

    def post(self, request):
        user = request.user
        data = request.data
        
        #이름이 빈값일 경우 Error처리
        name = data.get('name')
        category_name= data.get('category')
        currency_name=data.get('currency')

        #이름이 빈값일 경우 Error처리
        validated_data = validate_group_data(name, category_name, currency_name)
        if isinstance(validated_data, Response):
            return validated_data

        #같은 이름의 그룹이 존제시 error 처리
        group_name = user.Member_user.filter(group__name=name).exists()
        if group_name:
            return Response({'error': "같은 이름의 그룹이 이미 존재합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        group = Group.objects.create(
        name = validated_data['name'],
        category = validated_data['category'],
        currency = validated_data['currency']
        )

        #그룹에 관리자 Member로 추가
        grades =Member.objects.create(
            name=user.username,
            user=user,
            grades = Grades.objects.get(admin=1),
            group=group
        )

        return Response({'message': "그릅은 만들었습니다.",
                        'group_pk':group.pk,
                        'group_name': group.name,
                        'geades': grades.name},
                        status=status.HTTP_201_CREATED)



class GroupCategory(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categorys = get_list_or_404(Group_category)
        
        category = []
        for i in categorys:
            category.append({ 
                "category_id": i.pk,
                "category_name": i.name
                })
        return Response(category,status=status.HTTP_200_OK)


class GroupDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)
        
        return Response({
                "name": group.name,
                "category" : group.category.name,
                "currency": group.currency.currency,
                "created_at" :group.created_at,
                "edited_at" : group.edited_at
                }, status=status.HTTP_200_OK)


    def put(self, request, group_pk):
        user = request.user
        data = request.data
        group = get_object_or_404(Group, pk=group_pk)
        
        
        name = data.get('name', group.name)
        category = data.get('category',group.category.name)
        currency = data.get('currency',group.currency.currency)

        #이름이 빈값일 경우 Error처리
        validated_data = validate_group_data(name, category, currency)
        if isinstance(validated_data, Response):
            return validated_data
        
        #같은 이름의 그룹이 존제시 Error 처리 , 단 기존의 이름과 같은 경우는 제외
        group_name = user.Member_user.filter(group__name=name).exists()
        if name != group.name and group_name:
            return Response({'error': "같은 이름의 그룹이 이미 존재합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        

        group.name = validated_data["name"]
        group.category.name = validated_data["category"]
        group.currency.currency = validated_data["currency"]
        group.save()

        return Response({
                "name": group.name,
                "category" : str(group.category.name),
                "currency": str(group.currency.currency),
                "created_at" :group.created_at,
                "edited_at" : group.edited_at
                }, status=status.HTTP_200_OK)
        

    def delete(self, request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)

        group.delete()
        return Response({"message: 그룹을 삭제 했습니다."},status=status.HTTP_200_OK)