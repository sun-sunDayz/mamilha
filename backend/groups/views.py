from django.shortcuts import get_list_or_404, get_object_or_404, render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import *
from finances.models import Finance, Split

def validate_group_data(name, category_id):
    #이름이 빈 값일 경우 Error처리
    if not name:
        return Response({'error': "그룹 이름이 없습니다"},
                        status=status.HTTP_400_BAD_REQUEST)
    #카테고리가 빈 값일 경우 Error처리
    if category_id is '':
        return Response({'error': "그룹 카테고리를 선택해 주세요"},
                        status=status.HTTP_400_BAD_REQUEST)
    #없는 카테고리, 통화 선택시 error처리
    try:
        category = Group_category.objects.get(id=category_id)
    except Group_category.DoesNotExist:
        return Response({'error': "없는 카테고리입니다"},
                        status=status.HTTP_400_BAD_REQUEST)
    return{
        "name" : name,
        "category" : category, # 여기 확인
    }


class GroupAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        user = request.user
        # deleted가 False인 그룹만 가져오기
        groups_list = user.Member_user.filter(group__deleted=False)
        
        groups =[]
        for i in groups_list:
            members = Member.objects.filter(group_id = i.group_id)
            # members[0]은 언제나 관리자
            groups.append({
                "id" :  i.group_id,
                "name": i.group.name,
                "category_id": i.group.category.id,
                "category" : i.group.category.name,
                "category_icon" : i.group.category.icon,
                "category_icon_color" : i.group.category.icon_color,
                "currency": i.group.currency.currency,
                "leader" : members[0].name,
                "members": len(members)
                })

        return Response(groups,
                        status=status.HTTP_200_OK)
    

    def post(self, request):
        user = request.user
        data = request.data
        
        name = data.get('name')
        category_id = data.get('category')
        members = data.get('members')

        #빈 값일 경우 Error 처리
        validated_data = validate_group_data(name, category_id)
        if isinstance(validated_data, Response):
            return validated_data

        #같은 이름의 그룹이 존제시 error 처리
        group_name = user.Member_user.filter(group__name=name).exists()
        if group_name:
            return Response({'error': "같은 이름의 그룹이 이미 존재합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        #member name이 공백일 경유 제외, 같은 이름 존제시 오류, 멤머가 한명도 없는 경우 error 처리
        member_validated = []
        for member in members:
            if member['name'].strip():
                if member in member_validated:
                    return Response({'error': "그룹에 별명이 같은 멤버가 존제 합니다"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    member_validated.append(member)
            else:
                return Response({'error': "멤버는 한명 이상 있어야 합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        group = Group.objects.create(
        name = validated_data['name'],
        category = validated_data['category'],
        currency = Currency.objects.get(id=0)
        )

        #그룹 생성자 admin Member로 추가
        for member in member_validated:
            if member['id'] == 0:
                user=user
                grades = Grades.objects.get(admin=1)
            else:
                user=None
                grades=Grades.objects.get(admin=0, edit=0, view=1)
                
            Member.objects.create(
            name=member['name'],
            user=user,
            grades=grades,
            group=group)

        return Response({'message': "그릅은 만들었습니다.",
                        'group_pk': group.pk,
                        'group_name': group.name,
                        'member': members},
                        status=status.HTTP_201_CREATED)


class GroupCategoryAPIView(APIView):
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

class GroupCurrencyAPIView(APIView):
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


class GroupDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self,request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)
        members = get_list_or_404(Member, group = group)
        
        member = []
        num = 0
        for i in members:
            member.append({
                "id": num,
                "name": i.name,
                "active": i.active
            })
            num +=1

        return Response({
                "id": group.id,
                "name": group.name,
                "category" : group.category.id,
                "currency": group.currency.currency,
                "members" : member
                }, status=status.HTTP_200_OK)


    def put(self, request, group_pk):
        user = request.user
        data = request.data

        group = get_object_or_404(Group, pk=group_pk)
        old_members= get_list_or_404(Member, group = group)
        
        name = data.get('name', group.name)
        category_id = data.get('category',group.category.id)
        update_members = data.get('update_members', old_members)
        new_members = data.get('new_members')

        #빈 값일 경우 Error처리
        validated_data = validate_group_data(name, category_id)
        if isinstance(validated_data, Response):
            return validated_data
        
        #같은 이름의 그룹이 존제시 Error 처리, 단 기존의 이름과 같은 경우는 제외
        group_name = user.Member_user.filter(group__name=name).exists()
        if name != group.name and group_name:
            return Response({'error': "같은 이름의 그룹이 이미 존재합니다"}, status=status.HTTP_400_BAD_REQUEST)
        
        #update_members의 이름이 공백일 경우 Error처리
        val_up_members=[]
        for member in update_members:
            if member['name'].strip():
                val_up_members.append(member['name'])
            else:
                return Response({'error': "기존 멤버의 이름이 공백입니다"}, status=status.HTTP_400_BAD_REQUEST)

        #new_members이 이름이 공백일 경유 제외
        val_new_members=[]
        for member in new_members:
            if member['name'].strip():
                val_new_members.append(member['name'])

        #그룹에 별명이 같은 멤버있을 경우 Error처리
        if len(val_new_members + val_up_members) != len(set(val_new_members + val_up_members)):
            return Response({'error': "그룹에 별명이 같은 멤버가 존제 합니다"}, status=status.HTTP_400_BAD_REQUEST)

        group.name = validated_data["name"]
        group.category = validated_data["category"]
        group.currency.currency = Currency.objects.get(id=0)
        group.save()

        #기존의 멤버 업데이트
        for i in range(len(old_members)):
            old_members[i].name = update_members[i]['name']
            old_members[i].active = update_members[i]['active']
            old_members[i].save()
        
        #새로운 멤버는 추가, 없으면 추가 안함
        if val_new_members:
            for i in val_new_members:
                Member.objects.create(
                    name=i,
                    user=None,
                    grades=Grades.objects.get(admin=0, edit=0, view=1),
                    group=group)
        
        return Response({
                "name": group.name,
                "category_id" : str(group.category.id),
                "currency": str(group.currency.currency),
                "members" : new_members,
                "created_at" :group.created_at,
                "edited_at" : group.edited_at
                }, status=status.HTTP_200_OK)
        

    def delete(self, request, group_pk):
        group = get_object_or_404(Group, pk = group_pk)

        group.delete()
        return Response({"message: 그룹을 삭제 했습니다."},status=status.HTTP_200_OK)
    
class GroupSplitAPIView(APIView):
    # permission_classes = [IsAuthenticated]
    
    def get(self, request, group_pk):
        try:
            group = Group.objects.get(pk=group_pk)
        except Group.DoesNotExist:
            return Response({"message": "해당 그룹이 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

        # 해당 그룹의 모든 Finance 객체를 가져옴
        finances = Finance.objects.filter(group=group)
        
        data = []
        for finance in finances:
            # 각 Finance 객체에 대한 모든 Split 객체를 가져옴
            splits = Split.objects.filter(finance=finance)
            for split in splits:
                data.append({
                    "finance_id": split.finance.id,
                    "finance_description": split.finance.description,  # 추가 정보 포함
                    "payer": split.finance.payer.name,
                    "member": split.member.name,
                    "amount": split.amount,
                })

        return Response(data, status=status.HTTP_200_OK)

class MemberAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_pk):
        group = get_object_or_404(Group, pk=group_pk)

        member_list = group.Member_group.all()

        members = []
        for i in member_list:
            members.append({
                "id": i.pk,
                "name": i.name,
                "grades": i.grades.name,
                "active": i.active,
            })

        return Response(members,
                        status=status.HTTP_200_OK)

    # 멤버 생성
    def post(self, request, group_pk):
        group = get_object_or_404(Group, pk=group_pk)
        user = request.user

        # 권한 체크
        if not self.is_allowed_to_create(user):
            return Response({'error': "멤버 생성 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        id = data.get('id')
        name = data.get('name')
        grades = data.get('grades')
        active = data.get('active', True)

        # 이름이 빈값일 경우 Error 처리
        if not name:
            return Response({'error': "이름을 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        # 등급 없으면 Error 처리
        if not grades:
            return Response({'error': "등급을 선택해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        # 같은 이름 멤버 Error 처리
        if Member.objects.filter(group=group, name=name).exists():
            return Response({'error': "같은 이름의 멤버가 이미 존재합니다."}, status=status.HTTP_400_BAD_REQUEST)

        new_member = Member.objects.create(
            name=name,
            grades=grades,
            group=group,
            active=active,
        )

        return Response({
            "message": "멤버 추가가 완료되었습니다.",
            "member_pk": new_member.pk,
            "name": new_member.name,
            "grades": new_member.grades,
            "active": new_member.active,
        }, status=status.HTTP_201_CREATED)

    # 권한 체크 함수
    def is_allowed_to_create(self, user):
        try:
            user_grade = Member.objects.get(user=user).grades.name
            return user_grade in ["admin", "exec"]  # 수정 필요
        except Member.DoesNotExist:
            return False


class MemberDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_pk, member_pk):
        member = get_object_or_404(Member, pk=member_pk, group__pk=group_pk)

        return Response({
            "id": member.pk,
            "name": member.name,
            "grades": member.grades.name,
            "active": member.active,
        }, status=status.HTTP_200_OK)

    def put(self, request, group_pk, member_pk):
        member = get_object_or_404(Member, pk=member_pk, group__pk=group_pk)
        user = request.user

        # 권한 체크
        if not self.is_allowed_to_edit(user):
            return Response({'error': "멤버 수정 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        
        new_id = data.get('id', member.pk)
        new_name = data.get('name', member.name)
        new_grades = Grades.objects.get(
            name=data.get('grades', member.grades.name))
        new_active = data.get('active', member.active)

        # 이름이 빈값일 경우 Error 처리
        if not new_name:
            return Response({'error': "멤버 이름이 없습니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 같은 이름 멤버 Error 처리, 단 기존의 이름과 같은 경우는 제외
        if new_name != member.name and Member.objects.filter(group__pk=group_pk, name=new_name).exists():
            return Response({'error': "같은 이름의 멤버가 이미 존재합니다."}, status=status.HTTP_400_BAD_REQUEST)

        member.name = new_name
        member.grades = new_grades
        member.active = new_active

        member.save()

        return Response({
            "name": member.name,
            "grades": member.grades.name,
            "active": member.active,
        }, status=status.HTTP_200_OK)

    def delete(self, request, group_pk, member_pk):
        member = get_object_or_404(Member, pk=member_pk, group__pk=group_pk)
        user = request.user

        # 권한 체크
        if not self.is_allowed_to_edit(user):
            return Response({'error': "멤버 삭제 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        member.deleted = True
        member.save()
        return Response({"message: 멤버 삭제가 완료되었습니다."}, status=status.HTTP_200_OK)

    # 권한 체크 함수
    def is_allowed_to_edit(self, user):
        try:
            user_grade = Member.objects.get(user=user).grades.name
            return user_grade in ["admin", "exec"]  # 수정 필요
        except Member.DoesNotExist:
            return False


class MemberGradesAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        grades_list = Grades.objects.all()

        grades = []
        for grade in grades_list:
            grades.append({
                "id": grade.id,
                "name": grade.name,
                "admin": grade.admin,
                "edit": grade.edit,
                "view": grade.view,
            })

        return Response(grades, status=status.HTTP_200_OK)