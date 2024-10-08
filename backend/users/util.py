import re
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status


class AccountValidator:
    def __init__(self):
        self.response_data = Response({"valid": True}, status=status.HTTP_200_OK)

    def validate(self, validate_type: str, request_data) -> bool:
        self.response_data = Response({"valid": True}, status=status.HTTP_200_OK)
        data = request_data.get('data', None)
        if not data:
            self.response_data = Response({"error": "올바르지 않은 데이터 포맷입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        if validate_type == 'password':
            return self.validate_password(data)
        elif validate_type == 'username':
            return self.validate_username(data)
        elif validate_type == 'email':
            return self.validate_email(data)
        else:
            self.response_data = Response({"error": f"type(={validate_type})이 잘못 되었습니다."},
                                          status=status.HTTP_400_BAD_REQUEST)
            return False

    def validate_password(self, password: str) -> bool:
        # 글자수 8 이상
        if not (8 <= len(password)):
            self.response_data = Response({"error": "비밀번호는 8자리 이상이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        # 소문자 포함
        if not re.search(r"[a-z]", password):
            self.response_data = Response({"error": "비밀번호에는 소문자가 포함되어야 합니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        # 숫자 포함
        if not re.search(r"\d", password):
            self.response_data = Response({"error": "비밀번호에는 숫자가 포함되어야 합니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        # 특수문자 포함
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            self.response_data = Response({"error": "비밀번호에는 특수문자가 포함되어야 합니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        self.response_data = Response({"message": "비밀번호로 사용가능합니다."}, status=status.HTTP_200_OK)
        return True

    def validate_username(self, username: str) -> bool:
        # 글자수 5~15 이상
        if not (5 <= len(username) <= 15):
            self.response_data = Response({"error": "유저명은 5자 이상, 15자 이하입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        # 한글 및 특수문자 제한
        if re.search(r'[ㄱ-ㅎㅏ-ㅣ가-힣]|[^\w]', username):
            self.response_data = Response({"error": "유저명에는 한글 및 특수문자를 사용할 수 없습니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        # 이미 가입한 유저명 제한
        if get_user_model().objects.filter(username=username).exists():
            self.response_data = Response({"error": "이미 가입된 유저명입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False
        
        self.response_data = Response({"message": "사용 가능한 유저명입니다."}, status=status.HTTP_200_OK)
        return True

    def validate_email(self, email: str) -> bool:
        def is_valid_email(email):
            # 이메일 주소를 검증하는 정규 표현식
            pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
            return re.match(pattern, email) is not None

        if not is_valid_email(email):
            self.response_data = Response({"error": "올바르지 않은 이메일 주소입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        # 이미 가입한 이메일 제한
        if get_user_model().objects.filter(email=email).exists():
            self.response_data = Response({"error": "이미 가입한 이메일 주소입니다."}, status=status.HTTP_400_BAD_REQUEST)
            return False

        self.response_data = Response({"message": "사용 가능한 이메일 주소입니다."}, status=status.HTTP_200_OK)
        return True

    def get_response_data(self):
        return self.response_data
