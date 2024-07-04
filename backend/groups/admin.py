from django.contrib import admin
from .models import Group, Currency, Group_category, Member, Grades

# Register your models here.
admin.site.register(Group)
admin.site.register(Group_category)
admin.site.register(Currency)
admin.site.register(Member)
admin.site.register(Grades)

