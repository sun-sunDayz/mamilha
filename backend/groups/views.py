from django.shortcuts import get_list_or_404, get_object_or_404, render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import *



def validate_group_data(name, category_name, currency_name):
    #이름이 빈 값일 경우 Error처리
    if not name:
        return Response({'error': "그룹 이름이 없습니다"},
                        status=status.HTTP_400_BAD_REQUEST)
    #카테고리가 빈 값일 경우 Error처리
    if not category_name:
        return Response({'error': "그룹 카테고리를 선택해 주세요"},
                        status=status.HTTP_400_BAD_REQUEST)
    #통화가 빈 값일 경우 Error처리
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
        
        name = data.get('name')
        category_name = data.get('category')
        currency_name = data.get('currency')
        members = data.get('members')
            

        #빈 값일 경우 Error 처리
        validated_data = validate_group_data(name, category_name, currency_name)
        if isinstance(validated_data, Response):
            return validated_data

        #같은 이름의 그룹이 존제시 error 처리
        group_name = user.Member_user.filter(group__name=name).exists()
        if group_name:
            return Response({'error': "같은 이름의 그룹이 이미 존재합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        #멤머가 한명도 없는 경우 error 처리
        if not members:
            return Response({'error': "멤버는 한명 이상 있어야 합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        #member name이 공백일 경유 제외, 같은 이름 존제시 오류
        member_validated = []
        for member in members:
            if member['name'].strip():
                if member in member_validated:
                    return Response({'error': "그룹에 별명이 같은 멤버가 존제 합니다"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    member_validated.append(member)
        
        group = Group.objects.create(
        name = validated_data['name'],
        category = validated_data['category'],
        currency = validated_data['currency']
        )

        #그룹 생성자 admin Member로 추가
        Member.objects.create(
            name = user.username,
            user = user,
            grades = Grades.objects.get(admin=1),
            group = group
        )
        
        # for member in member_validated:
        #     Member.objects.create(
        #     name=member['name'],
        #     user=None,
        #     grades=Grades.objects.get(admin=0, edit=0, view=1),
        #     group=group)


        return Response({'message': "그릅은 만들었습니다.",
                        'group_pk': group.pk,
                        'group_name': group.name,
                        'member': members},
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

class GroupCurrency(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        currencys = get_list_or_404(Currency)
        
        currency = []
        for i in currencys:
            currency.append({ 
                "currency_id": i.pk,
                "currency_name": i.currency
                })
        return Response(currency,status=status.HTTP_200_OK)


class GroupDetail(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self,request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)
        members = get_list_or_404(Member, group = group)
        
        member = []
        num = 0
        for i in members[1::]:
            num +=1
            member.append({
                "id": num,
                "name": i.name,
                "active": i.active
            })

        return Response({
                "name": group.name,
                "category" : group.category.name,
                "currency": group.currency.currency,
                "member" : member
                }, status=status.HTTP_200_OK)


    def put(self, request, group_pk):
        user = request.user
        data = request.data
        group = get_object_or_404(Group, pk=group_pk)
        old_members= get_list_or_404(Member, group = group)[1:]
        
        name = data.get('name', group.name)
        category = data.get('category',group.category.name)
        currency = data.get('currency',group.currency.currency)
        new_members = data.get('members', old_members)


        #빈 값일 경우 Error처리
        validated_data = validate_group_data(name, category, currency)
        if isinstance(validated_data, Response):
            return validated_data
        
        #같은 이름의 그룹이 존제시 Error 처리, 단 기존의 이름과 같은 경우는 제외
        group_name = user.Member_user.filter(group__name=name).exists()
        if name != group.name and group_name:
            return Response({'error': "같은 이름의 그룹이 이미 존재합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        #member name이 공백일 경유 제외, 같은 이름 존제시 오류
        member_name=[]
        for member in new_members:
            if member['name'].strip():
                if member['name'] in member_name:
                    return Response({'error': "그룹에 별명이 같은 멤버가 존제 합니다"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    member_name.append(member['name'])
        
        group.name = validated_data["name"]
        group.category.name = validated_data["category"]
        group.currency.currency = validated_data["currency"]
        group.save()

        #기존의 멤버 업데이트
        for i in range(len(old_members)):
            old_members[i].name = new_members[i]['name']
            old_members[i].active = new_members[i]['active']
            old_members[i].save()
        
        #새로운 멤버는 추가
        for i in new_members[len(old_members)::]:
            Member.objects.create(
                name=i['name'],
                user=None,
                grades=Grades.objects.get(admin=0, edit=0, view=1),
                group=group)
        
        return Response({
                "name": group.name,
                "category" : str(group.category.name),
                "currency": str(group.currency.currency),
                "members" : new_members,
                "created_at" :group.created_at,
                "edited_at" : group.edited_at
                }, status=status.HTTP_200_OK)
        

    def delete(self, request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)

        group.delete()
        return Response({"message: 그룹을 삭제 했습니다."},status=status.HTTP_200_OK)