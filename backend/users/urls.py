from django.urls import path    
from . import views

urlpatterns = [
    path("", views.UsersAPIView.as_view()),
    path('password/', views.SetPasswordAPIView.as_view()),

]