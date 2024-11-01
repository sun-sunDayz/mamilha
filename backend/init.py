import random
import django
import os
from django.utils import timezone
from faker import Faker

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from finances.models import FinanceType
from finances.models import FinanceCategory
from finances.models import SplitMethod
from finances.models import PayMethod
from groups.models import Group_category
from groups.models import Grades
from groups.models import Currency

def add_initial_finance_categories():
    initial_data = [
        {'id': 1, 'name': '식사', 'icon': 'restaurant', 'icon_color': 'E87979'},
        {'id': 2, 'name': '카페', 'icon': 'cafe', 'icon_color': 'E8AE79'},
        {'id': 3, 'name': '술', 'icon': 'beer', 'icon_color': 'EBE677'},
        {'id': 4, 'name': '교통/주유', 'icon': 'car', 'icon_color': '79C7E8'},
        {'id': 5, 'name': '주거/생활', 'icon': 'home', 'icon_color': 'E8AE79'},
        {'id': 6, 'name': '장보기', 'icon': 'cart', 'icon_color': 'B7E879'},
        {'id': 7, 'name': '숙소', 'icon': 'bed', 'icon_color': '97A1B6'},
        {'id': 8, 'name': '영화/공연/전시회', 'icon': 'ticket', 'icon_color': 'B7E879'},
        {'id': 9, 'name': '운동', 'icon': 'barbell', 'icon_color': 'A379E8'},
        {'id': 10, 'name': '여가/취미', 'icon': 'bowling-ball', 'icon_color': '79C7E8'},
        {'id': 11, 'name': '기타', 'icon': 'ellipsis-horizontal-circle-sharp', 'icon_color': 'A379E8'},
    ]

    FinanceCategory.objects.all().delete()

    for category in initial_data:
        FinanceCategory.objects.create(**category)

    print('register finance category')
    for category in FinanceCategory.objects.all():
        print(f'{category.id}: {category.name}, {category.icon}, {category.icon_color}')
    

def add_initial_group_categories():
    initial_data = [
        {'id': 1, 'name': '친구', 'icon': 'sparkles', 'icon_color': 'EBE677'},
        {'id': 2, 'name': '동아리', 'icon': 'flame', 'icon_color': 'E87979'},
        {'id': 3, 'name': '회사', 'icon': 'business', 'icon_color': '79C7E8'},
        {'id': 4, 'name': '스포츠', 'icon': 'basketball', 'icon_color': 'A379E8'},
        {'id': 5, 'name': '취미', 'icon': 'headset', 'icon_color': 'E8AE79'},
        {'id': 6, 'name': '여행', 'icon': 'airplane', 'icon_color': '79C7E8'},
        {'id': 7, 'name': '스터디', 'icon': 'book', 'icon_color': 'B7E879'},
        {'id': 8, 'name': '가족', 'icon': 'home', 'icon_color': 'E8AE79'},
        {'id': 9, 'name': '학교', 'icon': 'school', 'icon_color': '97A1B6'},
        {'id': 10, 'name': '네트워킹', 'icon': 'people', 'icon_color': '97A1B6'},
        {'id': 11, 'name': '봉사/기부', 'icon': 'fitness', 'icon_color': 'E87979'},
        {'id': 12, 'name': '종교', 'icon': 'earth', 'icon_color': 'B7E879'},
        {'id': 13, 'name': '이벤트/행사', 'icon': 'musical-notes', 'icon_color': 'EBE677'},
        {'id': 14, 'name': '기타', 'icon': 'ellipsis-horizontal-circle-sharp', 'icon_color': 'A379E8'},
    ]

    Group_category.objects.all().delete()

    for category in initial_data:
        Group_category.objects.create(**category)

    print('register group category')
    for category in Group_category.objects.all():
        print(f'{category.id}: {category.name}, {category.icon}, {category.icon_color}')


def add_initial_currency_categories():
    initial_data = [
        {'id': 1, 'currency': '원'},
    ]

    Currency.objects.all().delete()

    for category in initial_data:
        Currency.objects.create(**category)

    print('register currency category')
    for category in Currency.objects.all():
        print(f'{category.id}: {category.currency}')


def add_initial_grades():
    initial_data = [
        {'id': 1, 'name': '관리자', 'admin': True, 'edit': True, 'view': True},
        {'id': 2, 'name': '임원', 'admin': False, 'edit': True, 'view': True},
        {'id': 3, 'name': '사용자', 'admin': False, 'edit': False, 'view': True},
    ]

    Grades.objects.all().delete()

    for g in initial_data:
        Grades.objects.create(**g)

    print('register grade')
    for g in Grades.objects.all():
        print(f'{g.id}: {g.name}, admin:{g.admin}, edit:{g.edit}, view:{g.view}')


def add_initial_split_method():
    initial_data = [
        {'id': 1, 'name': '고정분할'},
        {'id': 2, 'name': '수정분할'},
    ]

    SplitMethod.objects.all().delete()

    for g in initial_data:
        SplitMethod.objects.create(**g)

    print('register split method')
    for g in SplitMethod.objects.all():
        print(f'{g.id}: {g.name}')


def add_initial_pay_method():
    initial_data = [
        {'id': 1, 'name': '카드'},
        {'id': 2, 'name': '현금'},
    ]

    PayMethod.objects.all().delete()

    for g in initial_data:
        PayMethod.objects.create(**g)

    print('register pay method')
    for g in PayMethod.objects.all():
        print(f'{g.id}: {g.name}')


def add_initial_finance_type():
    initial_data = [
        {'id': 1, 'name': '지출'},
        {'id': 2, 'name': '수입'},
        {'id': 3, 'name': '정산'},
    ]

    FinanceType.objects.all().delete()

    for g in initial_data:
        FinanceType.objects.create(**g)

    print('register finance type')
    for g in FinanceType.objects.all():
        print(f'{g.id}: {g.name}')


print('init database')
add_initial_finance_categories()
add_initial_group_categories()
add_initial_currency_categories()
add_initial_grades()
add_initial_split_method()
add_initial_pay_method()
add_initial_finance_type()