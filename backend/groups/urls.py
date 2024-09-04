from django.urls import path    
from . import views

urlpatterns = [
    path("", views.GroupAPIView.as_view()),
    path("category/", views.GroupCategory.as_view()),
    path("currency/", views.GroupCurrency.as_view()),
    path("<int:group_pk>/", views.GroupDetail.as_view()),
    path("<int:group_pk>/splits/", views.GroupSplit.as_view()),
    path("<int:group_pk>/members/", views.MemberAPIView.as_view()),
    path("<int:group_pk>/members/<int:member_pk>/", views.MemberDetail.as_view()),
    path("members/grades/", views.MemberGrades.as_view()),
]