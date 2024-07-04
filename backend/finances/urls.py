from django.urls import path
from . import views

urlpatterns = [
    path("", views.FinancesAPIView.as_view()),
]
