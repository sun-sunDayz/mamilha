import random
import django
import os
from django.utils import timezone
from faker import Faker

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from finances.models import FinanceCategory

def add_initial_finance_categories():
    initial_data = [
        {'name': '쇼핑', 'icon': 'cart-outline', 'icon_color': 'iconGreen'},
        {'name': '외식', 'icon': 'restaurant-outline', 'icon_color': 'iconRed'},
        {'name': '교통', 'icon': 'car-outline', 'icon_color': 'iconBlue'},
        {'name': '주류', 'icon': 'beer-outline', 'icon_color': 'iconOrange'},
        {'name': '주유', 'icon': 'card-outline', 'icon_color': 'iconYellow'},
        {'name': '기타', 'icon': 'ellipsis-horizontal-circle-outline', 'icon_color': 'iconPurple'},
    ]

    FinanceCategory.objects.all().delete()

    for category in initial_data:
        FinanceCategory.objects.create(**category)

    print('register finance category')
    for category in FinanceCategory.objects.all():
        print(f'{category.name}, {category.icon}, {category.icon_color}')
    



print('init finance category')
add_initial_finance_categories()