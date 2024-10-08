import random
import django
import os
from django.utils import timezone
from faker import Faker

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from groups.models import Group, Group_category, Currency, Member, Grades
from users.models import User

def generate_random_data(total_groups, members_per_group):
    faker = Faker()

    # Get existing Group categories, Currencies, and Grades
    group_categories = list(Group_category.objects.all())
    currencies = list(Currency.objects.all())
    grades = list(Grades.objects.all())

    if not group_categories or not currencies or not grades:
        raise ValueError("There must be at least one Group_category, one Currency, and one Grades in the database.")

    # Create Groups
    for _ in range(total_groups):
        group_data = {
            'name': faker.company(),
            'category': random.choice(group_categories),
            'currency': random.choice(currencies),
            'created_at': faker.date_time_between(start_date='-1y', end_date='now', tzinfo=timezone.get_current_timezone()),
            'edited_at': faker.date_time_between(start_date='-1y', end_date='now', tzinfo=timezone.get_current_timezone()),
            'deleted': 0,
            'deleted_at': None,
        }
        group = Group.objects.create(**group_data)

        members_number = random.randint(3, members_per_group)

        # Create Members for each Group
        for _ in range(members_number):
            if random.random() < 0.2:  # 1/5 확률로 User가 없음
                user = None
                name = faker.name()
            else:
                user = User.objects.order_by('?').first()  # 랜덤한 사용자 선택
                name = user.username if user else faker.name()

            grade = random.choice(grades) if grades else None  # 랜덤한 Grades 선택
            
            # 만약 grade가 None이면 오류를 발생시키거나 기본값을 설정
            if grade is None:
                raise ValueError("There must be at least one Grades in the database.")

            member_data = {
                'name': name,
                'user': user,
                'grades': grade,
                'group': group,
                'active': random.choice([True, False]),
                'balance': random.randint(-1000, 1000),  # 랜덤한 잔액 설정
            }
            Member.objects.create(**member_data)

# 생성할 Group 수와 각 Group 당 Member 수 설정
generate_random_data(total_groups=100, members_per_group=5)
