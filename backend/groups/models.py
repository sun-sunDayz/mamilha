from django.db import models
from django.utils import timezone
from users.models import *

# Create your models here.

class Group_category(models.Model):
    name = models.CharField(max_length=20,unique=True)

    def __str__(self):
        return self.name


class Currency(models.Model):
    currency = models.CharField(max_length=20,unique=True)

    def __str__(self):
        return self.currency


class GroupManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=0)
    
    def deleted_groups(self):
        return super().get_queryset().filter(deleted=1)


class Group(models.Model):
    name = models.CharField(max_length=20)
    category = models.ForeignKey(Group_category, on_delete=models.CASCADE, related_name='Group_cat')
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='Group_cur')
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted = models.BooleanField(default=0)

    objects = GroupManager()

    def delete(self,*args, **kwargs):
        self.deleted = 1
        self.deleted_at = timezone.now()
        self.save()
        
    def __str__(self):
        return self.name


class Grades(models.Model):
    name = models.CharField(max_length=20)
    admin = models.BooleanField(default=0)
    edit = models.BooleanField(default=0)
    view = models.BooleanField(default=0)


class MemberManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=0)
    
    def deleted_groups(self):
        return super().get_queryset().filter(deleted=1)


class Member(models.Model):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='Member_user',null=True)
    grades = models.ForeignKey(Grades, on_delete=models.CASCADE, related_name='Member_grades')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='Member_group')
    active = models.BooleanField(default=1)
    deleted = models.BooleanField(default=0)
    balance = models.IntegerField(default=0)

    def delete(self,*args, **kwargs):
        self.deleted = 1
        self.save()