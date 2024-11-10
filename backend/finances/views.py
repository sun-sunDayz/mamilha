from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from groups.models import Group, Member
from .models import Finance, FinanceCategory, FinanceType, PayMethod, SplitMethod, Split
from django.utils import timezone

class FinancesAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, group_pk):
        group = Group.objects.get(pk=group_pk)
        finances = Finance.objects.filter(group=group, deleted=0)
        data = []
        for finance in finances:
            data.append({
                "id": finance.id,
                "amount": finance.amount,
                "description": finance.description,
                "payer": finance.payer.name,
                "finance_type": finance.finance_type.name,
                "finance_category": finance.finance_category.id,
                "finance_category_icon": finance.finance_category.icon,
                "finance_category_icon_color": finance.finance_category.icon_color,
                "pay_method": finance.pay_method.name,
                "split_method": finance.split_method.name,
                "date": finance.date,
            })
        return Response(data)
    
    def post(self, request, group_pk):
        data = request.data
        group = Group.objects.get(pk=group_pk)
        amount = data.get('amount', None)
        amount = int(str(amount).replace(",", ""))
        description = data.get('description', None)
        select_members = data.get('members', [])

        # 하단의 정보들은 테이블에서 레코드 탐색을 해야함
        payer = data.get('payer', None)
        finance_type = data.get('finance_type', None)
        finance_category = data.get('finance_category', None)
        pay_method = data.get('pay_method', None)
        split_method = data.get('split_method', None)

        try:
            print(f'amount={amount}, payer={payer}, group={group}, finance type={finance_type}, cate={finance_category}, method={pay_method}, split_method={split_method}')
            payer = Member.objects.get(id=payer, group=group)
            finance_type = FinanceType.objects.get(name=finance_type)
            finance_category = FinanceCategory.objects.get(id=finance_category)
            pay_method = PayMethod.objects.get(name=pay_method)
            split_method = SplitMethod.objects.get(name=split_method)
        except Member.DoesNotExist:
            return Response({"message": "해당 그룹에 속하지 않은 결제자입니다."}, status=status.HTTP_400_BAD_REQUEST)
        except (FinanceType.DoesNotExist, FinanceCategory.DoesNotExist, PayMethod.DoesNotExist, SplitMethod.DoesNotExist):
            return Response({"message": "잘못된 결제 유형, 카테고리, 결제 방법 또는 정산 방법입니다."}, status=status.HTTP_400_BAD_REQUEST)
        
        finance = Finance.objects.create(
            group=group,
            amount=amount,
            description=description,
            payer=payer,
            finance_type=finance_type,
            finance_category=finance_category,
            pay_method=pay_method,
            split_method=split_method
        )
        # if split_method == '고정분할' :
        select_members_id = [i['id'] for i in select_members]
        members = Member.objects.filter(group=group, id__in=select_members_id)
        member_count = members.count()
        if member_count > 0:
            for member in members:
                select_member_data = next((item for item in select_members if item['id'] == member.id), None)
                if select_member_data:
                    Split.objects.create(
                        finance=finance,
                        member=member,
                        amount=select_member_data['amount'])
        
        return Response(status=status.HTTP_201_CREATED)
    
class FinancesDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, group_pk, finance_pk):
        finance = Finance.objects.get(pk=finance_pk)
        split = Split.objects.filter(finance_id=finance.id)
        
        if finance.group.pk != group_pk:
            return Response({"message": "해당 그룹에 속한 결제 내역이 아닙니다."}, status=status.HTTP_400_BAD_REQUEST)
        # 해단 finance에 속한 멤버 가져오기
        members =[]
        for member in split:
            members.append({
                "id" : member.member.id,
                "name" : member.member.name,
                "user_id" : member.member.user_id,
            })

        data = {
            "id": finance.id,
            "amount": finance.amount,
            "description": finance.description,
            "payer": {"id": finance.payer.id, "name": finance.payer.name},
            "finance_type": finance.finance_type.name,
            "finance_category": {"id": finance.finance_category.id, "name": finance.finance_category.name},
            "pay_method": finance.pay_method.name,
            "split_method": finance.split_method.name,
            "date" : finance.date,
            "member" : members
        }
        return Response(data)
    
    def put(self, request, group_pk, finance_pk):
        finance = Finance.objects.get(pk=finance_pk)
        if finance.group.pk != group_pk:
            return Response({"message": "해당 그룹에 속한 결제 내역이 아닙니다."}, status=status.HTTP_400_BAD_REQUEST)
        data = request.data
        amount = data.get('amount', finance.amount)
        description = data.get('description', finance.description)
        select_members = data.get('members', [])
        
        # 하단의 정보들은 테이블에서 레코드 탐색을 해야함
        payer = data.get('payer', finance.payer.id)
        finance_type = data.get('finance_type', finance.finance_type.name)
        finance_category = data.get('finance_category', finance.finance_category.id)
        pay_method = data.get('pay_method', finance.pay_method.name)
        split_method = data.get('split_method', finance.split_method.name)
        
        try:
            payer = Member.objects.get(id=payer)
            finance_type = FinanceType.objects.get(name=finance_type)
            finance_category = FinanceCategory.objects.get(id=finance_category)
            pay_method = PayMethod.objects.get(name=pay_method)
            split_method = SplitMethod.objects.get(name=split_method)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        finance.amount = amount
        finance.description = description
        finance.payer = payer
        finance.finance_type = finance_type
        finance.finance_category = finance_category
        finance.pay_method = pay_method
        finance.split_method = split_method
        finance.edited_at = timezone.now()
        finance.save()

        #기존 split 값 삭제
        splits = Split.objects.filter(finance=finance)
        for split in splits:
            split.deleted = True
            split.deleted_at = timezone.now()  # deleted_at을 현재 시간으로 설정
            split.save()

        #새로운 split 값 생성 
        select_members_id = [i['id'] for i in select_members]
        members = Member.objects.filter(group_id=finance.group_id, id__in=select_members_id)
        member_count = members.count()
        if member_count > 0:
            for member in members:
                select_member_data = next((item for item in select_members if item['id'] == member.id), None)
                if select_member_data:
                    Split.objects.create(
                        finance=finance,
                        member=member,
                        amount=select_member_data['amount'])
        
        return Response({"message":"결제 내역이 수정되었습니다."},status=status.HTTP_200_OK)
    
    def delete(self, request, group_pk, finance_pk):
        finance = Finance.objects.get(pk=finance_pk)
        if finance.group.pk != group_pk:
            return Response({"message": "해당 그룹에 속한 결제 내역이 아닙니다."}, status=status.HTTP_400_BAD_REQUEST)
        splits = Split.objects.filter(finance=finance)
        for split in splits:
            split.deleted = True
            split.deleted_at = timezone.now()  # deleted_at을 현재 시간으로 설정
            split.save()
        finance.deleted = True
        finance.deleted_at = timezone.now()
        finance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
class FinancesSplitAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, finance_pk):
        user = request.user.username
        finance = Finance.objects.get(pk=finance_pk)
        # splits = finance.split_set.all()
        splits = Split.objects.filter(finance = finance, deleted=0)
        data = []
        for split in splits:
            split_data = {
            "finance_id": split.finance.id,
            "member": split.member.name,
            "amount": split.amount,
            }

            if split.member.name == user:
                split_data["currencyUser"] = user
        
            data.append(split_data)
        return Response(data)
    
    def post(self, request, finance_pk):
        finance = Finance.objects.get(pk=finance_pk)
        group = Group.objects.get(pk=finance.group.pk)
        data = request.data
        members = data.get('members', None)
        amounts = data.get('amounts', None)
        if len(members) != len(amounts):
            return Response({"message": "멤버와 금액이 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)
        for member, amount in zip(members, amounts):
            try:
                member = Member.objects.get(group=group, id=member)
            except:
                return Response({"message":"해당 그룹에 속하지 않은 멤버가 존재합니다."},status=status.HTTP_400_BAD_REQUEST)
            split = finance.split_set.create(
                member=member,
                amount=amount
            )
            return Response(status=status.HTTP_201_CREATED)
        

        
class FinanceCategorysAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        finance_categorys = FinanceCategory.objects.all()
        categorys = []
        for category in finance_categorys:
            categorys.append({
                "id" : category.id,
                "name" : category.name,
                "icon" : category.icon,
                "icon_color" : category.icon_color,
                "finance_type_id" : category.finance_type_id,
            })
        return Response(categorys, status=status.HTTP_200_OK)
