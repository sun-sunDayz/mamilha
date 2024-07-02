from django.urls import path    
from . import views

urlpatterns = [
    path("", views.AccAPIView.as_view()),
]