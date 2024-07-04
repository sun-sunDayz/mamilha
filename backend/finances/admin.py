from django.contrib import admin
from .models import Finance, FinanceCategory, FinanceType, PayMethod, SplitMethod
# Register your models here.

admin.site.register(Finance)
admin.site.register(FinanceCategory)
admin.site.register(FinanceType)
admin.site.register(PayMethod)
admin.site.register(SplitMethod)