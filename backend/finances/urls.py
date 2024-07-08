from django.urls import path
from . import views

urlpatterns = [
    path("", views.FinancesAPIView.as_view()),
    path("paymethods/", views.PayMethods.as_view()),
    path("splitmethods/", views.SplitMethods.as_view()),
]
