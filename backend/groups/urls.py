from django.urls import path    
from . import views

urlpatterns = [
    path("", views.GroupAPIView.as_view()),
    path("category/", views.GroupCategoryAPIView.as_view()),
    path("currency/", views.GroupCurrencyAPIView.as_view()),
    path("<int:group_pk>/", views.GroupDetailAPIView.as_view()),
    path("<int:group_pk>/splits/", views.GroupSplitAPIView.as_view()),
    path("<int:group_pk>/members/", views.MemberAPIView.as_view()),
    path("<int:group_pk>/members/<int:member_pk>/", views.MemberDetailAPIView.as_view()),
    path("members/grades/", views.MemberGradesAPIView.as_view()),
    path("invite/", views.GroupInviteCodeAPIView.as_view()),
]