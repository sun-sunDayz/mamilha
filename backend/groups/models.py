from django.db import models
from django.utils import timezone

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
    category = models.ForeignKey(Group_category, on_delete=models.CASCADE)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted = models.IntegerField(default=0)

    objects = GroupManager()

    def delete(self,*args, **kwargs):
        self.deleted = 1
        self.deleted_at = timezone.now()
        self.save()
        
    def __str__(self):
        return self.name