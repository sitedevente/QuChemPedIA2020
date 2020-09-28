from django.urls import path
from . import views

urlpatterns = [
    path('recherche/', views.search, name='search'),
    path('detail/', views.detail, name='detail'),
]
