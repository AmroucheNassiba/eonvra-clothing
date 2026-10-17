from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('orders/', views.create_order, name='create-order'),
    path('newsletter/', views.subscribe_newsletter, name='newsletter-subscribe'),
]
