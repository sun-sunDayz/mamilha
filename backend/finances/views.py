from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from groups.models import Group, Member
from .models import Finance, FinanceCategory, FinanceType, PayMethod, SplitMethod
from django.utils import timezone

class FinancesAPIView(APIView):
    def get(self, request, group_pk):
        group = Group.objects.get(pk=group_pk)
        finances = Finance.objects.filter(group=group)
        data = []
        for finance in finances:
            data.append({
                "id": finance.id,
                "amount": finance.amount,
                "description": finance.description,
                "payer": finance.payer.name,
                "finance_type": finance.finance_type.name,
                "finance_category": finance.finance_category.name,
                "pay_method": finance.pay_method.name,
                "split_method": finance.split_method.name,
                "date": finance.created_at.strftime("%Y.%m.%d")
            })
        return Response(data)
    
    def post(self, request, group_pk):
        data = request.data
        group = Group.objects.get(pk=group_pk)
        amount = data.get('amount', None)
        description = data.get('description', None)

        # 하단의 정보들은 테이블에서 레코드 탐색을 해야함
        payer = data.get('payer', None)
        finance_type = data.get('finance_type', None)
        finance_category = data.get('finance_category', None)
        pay_method = data.get('pay_method', None)
        split_method = data.get('split_method', None)
        
        try:
            payer = Member.objects.get(name=payer)
            finance_type = FinanceType.objects.get(name=finance_type)
            finance_category = FinanceCategory.objects.get(name=finance_category)
            pay_method = PayMethod.objects.get(name=pay_method)
            split_method = SplitMethod.objects.get(name=split_method)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
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

        return Response(status=status.HTTP_201_CREATED)
    
class FinancesDetailAPIView(APIView):

    def get(self, request, group_pk, finance_pk):
        finance = Finance.objects.get(pk=finance_pk)
        if finance.group.pk != group_pk:
            return Response({"message": "해당 그룹에 속한 결제 내역이 아닙니다."}, status=status.HTTP_400_BAD_REQUEST)
        data = {
            "id": finance.id,
            "amount": finance.amount,
            "description": finance.description,
            "payer": finance.payer.name,
            "finance_type": finance.finance_type.name,
            "finance_category": finance.finance_category.name,
            "pay_method": finance.pay_method.name,
            "split_method": finance.split_method.name,
            "date" : finance.date
        }
        return Response(data)
    
    def put(self, request, group_pk, finance_pk):
        finance = Finance.objects.get(pk=finance_pk)
        if finance.group.pk != group_pk:
            return Response({"message": "해당 그룹에 속한 결제 내역이 아닙니다."}, status=status.HTTP_400_BAD_REQUEST)
        data = request.data
        amount = data.get('amount', finance.amount)
        description = data.get('description', finance.description)

        # 하단의 정보들은 테이블에서 레코드 탐색을 해야함
        payer = data.get('payer', finance.payer.name)
        finance_type = data.get('finance_type', finance.finance_type.name)
        finance_category = data.get('finance_category', finance.finance_category.name)
        pay_method = data.get('pay_method', finance.pay_method.name)
        split_method = data.get('split_method', finance.split_method.name)
        
        try:
            payer = Member.objects.get(name=payer)
            finance_type = FinanceType.objects.get(name=finance_type)
            finance_category = FinanceCategory.objects.get(name=finance_category)
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

        return Response({"message":"결제 내역이 수정되었습니다."},status=status.HTTP_200_OK)
    
    def delete(self, request, group_pk, finance_pk):
        finance = Finance.objects.get(pk=finance_pk)
        if finance.group.pk != group_pk:
            return Response({"message": "해당 그룹에 속한 결제 내역이 아닙니다."}, status=status.HTTP_400_BAD_REQUEST)
        finance.deleted = True
        finance.deleted_at = timezone.now()
        finance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class FinancesSplitAPIView(APIView):

    def get(self, request, finance_pk):
        finance = Finance.objects.get(pk=finance_pk)
        splits = finance.split_set.all()
        data = []
        for split in splits:
            data.append({
                "finance_id": split.finance.id,
                "member": split.member.name,
                "amount": split.amount
            })
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
                member = Member.objects.get(group=group, name=member)
            except:
                return Response({"message":"해당 그룹에 속하지 않은 멤버가 존재합니다."},status=status.HTTP_400_BAD_REQUEST)
            split = finance.split_set.create(
                member=member,
                amount=amount
            )
            return Response(status=status.HTTP_201_CREATED)
        
        
