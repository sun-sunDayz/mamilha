from django.contrib import admin
from .models import Group, Currency, Group_category

# Register your models here.
admin.site.register(Group)
admin.site.register(Group_category)
admin.site.register(Currency)
