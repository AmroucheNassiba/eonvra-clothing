from django.urls import path
from . import views

urlpatterns = [
    path('feed/', views.instagram_feed, name='instagram-feed'),
    path('status/', views.instagram_status, name='instagram-status'),
]
