import random
from django_seed import Seed
import django
import os
from django.utils import timezone  # 날짜 및 시간 처리를 위한 timezone 모듈 임포트
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from faker import Faker
from users.models import User

def generate_random_users(total_users):
    seeder = Seed.seeder()
    faker = Faker()

    seeder.add_entity(User, total_users, {
        'username': lambda x: faker.user_name(),
        'email': lambda x: faker.email(),
        'password': 'pbkdf2_sha256$600000$tXmX60GePKH2n2qqYjBkJi$OaWav+TrpbAv5pJ7bfvaKx6AeUfqTFlb+Z+e8Yzc6wg=',  # 원하는 패스워드 해시를 사용
        'nickname': lambda x: faker.user_name(),  # 랜덤 닉네임 생성
        'edited_at': lambda x: faker.date_time_between(start_date='-1y', end_date='now', tzinfo=timezone.get_current_timezone()),  # edited_at 날짜/시간 생성 예시
        'deleted': False,  
        'deleted_at': None, 
    })
    seeder.execute()


# 생성할 사용자 수 지정
generate_random_users(300)