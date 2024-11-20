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
from groups.models import Member

from django.db import transaction
from django.db.models import Count
import groups.models

def delete_duplicate_members():
    # 중복된 user와 group 조합을 찾기 위해 쿼리셋을 생성합니다.
    duplicates = (
        Member.objects
        .values('user', 'group')
        .annotate(count=Count('id'))
        .filter(count__gt=1)  # 중복된 (user, group) 조합만 필터링
    )

    with transaction.atomic():
        for duplicate in duplicates:
            user = duplicate['user']
            group = duplicate['group']
            
            # 중복된 (user, group) 조합에 해당하는 Member 객체들을 필터링
            members = Member.objects.filter(user=user, group=group)
            
            # 첫 번째 객체를 제외한 나머지 중복 객체를 삭제
            members.exclude(id=members.first().id).delete()

    print("중복된 멤버 삭제 완료")

delete_duplicate_members()


