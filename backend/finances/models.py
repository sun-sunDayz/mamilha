from django.db import models
from django.utils import timezone
from groups.models import Group, Member

class FinanceType(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    
class FinanceCategory(models.Model):
    #finance_type에 1,3만 들어가도록 설정
    finance_type_choices =[
        (1, '지출'),
        (3, '이체')
    ]
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100)
    icon_color = models.CharField(max_length=100)
    finance_type_id = models.IntegerField(default=1, choices=finance_type_choices)
    def __str__(self):
        return self.name

class PayMethod(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class SplitMethod(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

# Create your models here.
class Finance(models.Model):
    payer = models.ForeignKey(Member, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    finance_type = models.ForeignKey(FinanceType, on_delete=models.CASCADE)
    finance_category = models.ForeignKey(FinanceCategory, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    description = models.TextField(null=True, blank=True)

    pay_method = models.ForeignKey(PayMethod, on_delete=models.CASCADE)
    split_method = models.ForeignKey(SplitMethod, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.description
    
class Split(models.Model):
    finance = models.ForeignKey(Finance, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.finance} - {self.member}'