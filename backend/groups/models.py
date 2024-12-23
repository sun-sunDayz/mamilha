from django.db import models
from django.utils import timezone
from users.models import *


class Group_category(models.Model):
    name = models.CharField(max_length=20, unique=True)
    icon = models.CharField(max_length=30, default='')
    icon_color = models.CharField(max_length=10, default='')

    def __str__(self):
        return self.name


class Currency(models.Model):
    currency = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.currency

# Groups.objects.all()시 deleted가 0인 값만 가져오기


class GroupManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=0)

    def deleted_groups(self):
        return super().get_queryset().filter(deleted=1)


class Group(models.Model):
    name = models.CharField(max_length=20)
    category = models.ForeignKey(
        Group_category, on_delete=models.CASCADE, related_name='Group_cat')
    currency = models.ForeignKey(
        Currency, on_delete=models.CASCADE, related_name='Group_cur')
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted = models.BooleanField(default=False)

    objects = GroupManager()

    def delete(self, *args, **kwargs):
        self.deleted = 1
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return f'[{self.category}] {self.name}'


class GradeManager(models.Manager):
    def get_by_auth(self, group, member, expense, view_setting, view_expense):
        return super().get_queryset().filter(group=group, member=member, expense=expense, view_setting=view_setting, view_expense=view_expense).first()

    def get_admin(self):
        """관리자 등급 가져오기"""
        return self.get_by_auth(group=True, member=True, expense=True, view_setting=True, view_expense=True)

    def get_manager(self):
        """임원 등급 가져오기"""
        return self.get_by_auth(group=False, member=True, expense=True, view_setting=True, view_expense=True)

    def get_secretary(self):
        """총무 등급 가져오기"""
        return self.get_by_auth(group=False, member=False, expense=True, view_setting=True, view_expense=True)

    def get_member(self):
        """회원 등급 가져오기"""
        return self.get_by_auth(group=False, member=False, expense=False, view_setting=True, view_expense=True)

    def get_guest(self):
        """게스트 등급 가져오기"""
        return self.get_by_auth(group=False, member=False, expense=False, view_setting=False, view_expense=False)

class Grades(models.Model):
    name = models.CharField(max_length=20)
    admin = models.BooleanField(default=0)  # 삭제 예정
    edit = models.BooleanField(default=0)  # 삭제 예정
    view = models.BooleanField(default=0)  # 삭제 예정
    group = models.BooleanField(default=0)
    member = models.BooleanField(default=0)
    expense = models.BooleanField(default=0)
    view_setting = models.BooleanField(default=0)
    view_expense = models.BooleanField(default=0)
    visible = models.BooleanField(default=0)
    color = models.CharField(max_length=10, default='')

    objects = GradeManager()

    def __str__(self):
        return self.name



# Member.objects.all() 사용시 deleted가 0인 값만 가져오기
class MemberManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=0)

    def deleted_groups(self):
        return super().get_queryset().filter(deleted=1)

    def get_admin_member(self, group_id):
        admin_grade = Grades.objects.get_admin()  # 관리자 등급 가져오기
        if admin_grade:
            # 해당 그룹에서 관리자 등급을 가진 멤버를 필터링
            return self.get_queryset().filter(group_id=group_id, grades=admin_grade).first()
        return None


class Member(models.Model):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='Member_user', null=True, blank=True)
    grades = models.ForeignKey(
        Grades, on_delete=models.CASCADE, related_name='Member_grades')
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name='Member_group')
    active = models.BooleanField(default=1)
    deleted = models.BooleanField(default=0)
    balance = models.IntegerField(default=0)

    objects = MemberManager()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=[
                                    'user', 'group'], name='unique_user_group', condition=models.Q(user__isnull=False))
        ]

    def delete(self, *args, **kwargs):
        self.deleted = 1
        self.save()

    def __str__(self):
        return f'{self.group} - {self.name}'


class GroupInviteCode(models.Model):
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name='invite_codes')
    invite_code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.active:
            GroupInviteCode.objects.filter(
                group=self.group, active=True).update(active=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'[{self.group.nae}] {self.invite_code} {self.active}'
