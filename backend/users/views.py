from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view
from .util import AccountValidator
from . import permissions

User = get_user_model()
validator = AccountValidator()
# Create your views here.

class UsersAPIView(APIView):
    permission_classes = [permissions.UsersVIEWPermission]
    #프로필 조회
    def get(self, request):
        return Response({
            "nickname": request.user.nickname,
            "email": request.user.email,
        })
    
    #회원가입
    def post(self, request):
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        nickname = data.get('nickname', None)
        email = data.get('email', None)

        get_user_model().objects.create_user(
            username=username, password=password, email=email, nickname=nickname)
        
        return Response({
            "username": username,
            "password": password,
            "email": email,
            "nickname": nickname,
        }, status=status.HTTP_201_CREATED)
    
    #프로필 수정
    def put(self, request):
        user = request.user
        data = request.data
        nickname = data.get('nickname', user.nickname)
        email = data.get('email', user.email)

        user.email = email
        user.nickname = nickname
        user.save()

        return Response({
            "message": "회원 정보가 수정되었습니다"
        }, status=status.HTTP_200_OK)
    
    #계정 탈퇴
    def delete(self, request):
        user = request.user
        if request.data.get('password') and check_password(request.data.get('password'), user.password):
            user.delete()
            return Response({"message": f"계정이 삭제되었습니다"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "비밀번호가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)
    
class SetPasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    #패스워드 변경
    def put(self, request):
        data = request.data
        user = request.user

        old_password = data.get('old_password', None)
        new_password = data.get('new_password', None)

        if not old_password or not new_password:
            return Response({"error": "잘못된 전송 포맷입니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 이전 비밀번호 일치 체크
        if not check_password(old_password, user.password):
            return Response({"error": "입력하신 비밀번호가 이전과 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "비밀번호가 수정되었습니다."}, status=status.HTTP_200_OK)
    
    #패스워드 확인
    def post(self, request):
        data = request.data
        user = request.user

        password = data.get('password', None)

        if not password:
            return Response({"error": "잘못된 전송 포맷입니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 비밀번호 일치 체크
        if not check_password(password, user.password):
            return Response({"error": "비밀번호가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "인증에 성공했습니다."}, status=status.HTTP_200_OK)

@api_view(['POST'])
def validate_password(request):
    validator.validate('password', request.data)
    return validator.get_response_data()


@api_view(['POST'])
def validate_username(request):
    validator.validate('username', request.data)
    return validator.get_response_data()


@api_view(['POST'])
def validate_email(request):
    validator.validate('email', request.data)
    return validator.get_response_data()

