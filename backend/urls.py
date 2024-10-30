from django.urls import path, include

urlpatterns = [
    path('groups/', include('groups.urls')),
    path('finances/', include('finances.urls')),
    path('users/', include('users.urls')),
]