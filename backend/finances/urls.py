from django.urls import path
from . import views

urlpatterns = [
    path("<int:group_pk>/", views.FinancesAPIView.as_view()),
    path("<int:group_pk>/<int:finance_pk>/", views.FinancesDetailAPIView.as_view()),
    path("<int:finance_pk>/splits/", views.FinancesSplitAPIView.as_view()),
]
