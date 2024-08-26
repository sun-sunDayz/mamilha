import random
import django
import os
from django.utils import timezone
from faker import Faker

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from groups.models import Group, Member
from finances.models import Finance, Split, FinanceType, FinanceCategory, PayMethod, SplitMethod

def generate_random_finances(total_finances, splits_per_finance):
    faker = Faker()

    # Get existing data from the related models
    finance_types = list(FinanceType.objects.all())
    finance_categories = list(FinanceCategory.objects.all())
    pay_methods = list(PayMethod.objects.all())
    split_methods = list(SplitMethod.objects.all())
    groups = list(Group.objects.all())

    if not finance_types or not finance_categories or not pay_methods or not split_methods or not groups:
        raise ValueError("All necessary related data (FinanceType, FinanceCategory, PayMethod, SplitMethod, Group) must be present in the database.")

    # Create Finance entries
    for _ in range(total_finances):
        group = random.choice(groups)
        
        # 그룹에 멤버가 없으면 건너뛰기
        if not group.Member_group.exists():
            continue
        
        payer = random.choice(group.Member_group.all())  # related_name='Member_group' 사용

        finance_data = {
            'payer': payer,
            'group': group,
            'finance_type': random.choice(finance_types),
            'finance_category': random.choice(finance_categories),
            'amount': round(random.uniform(10.00, 1000.00), 2),  # Random amount between 10 and 1000
            'date': faker.date_this_year(),
            'description': faker.sentence(),
            'pay_method': random.choice(pay_methods),
            'split_method': random.choice(split_methods),
            'deleted': False,
            'deleted_at': None,
        }
        finance = Finance.objects.create(**finance_data)

        # Create Split entries for each Finance
        for _ in range(splits_per_finance):
            member = random.choice(group.Member_group.all())  # related_name='Member_group' 사용
            split_data = {
                'finance': finance,
                'member': member,
                'amount': round(finance.amount / splits_per_finance, 2),
                'deleted': False,
                'deleted_at': None,
            }
            Split.objects.create(**split_data)

# 생성할 Finance 수와 각 Finance 당 Split 수 설정
generate_random_finances(total_finances=50, splits_per_finance=3)
