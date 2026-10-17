from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Product, Order, NewsletterSubscriber
from .serializers import (
    CategorySerializer, ProductSerializer,
    OrderSerializer, NewsletterSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Product.objects.filter(stock__gt=0)
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        new_arrival = self.request.query_params.get('new_arrival')
        bestseller = self.request.query_params.get('bestseller')
        search = self.request.query_params.get('search')

        if category:
            queryset = queryset.filter(category__slug=category)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        if new_arrival == 'true':
            queryset = queryset.filter(is_new_arrival=True)
        if bestseller == 'true':
            queryset = queryset.filter(is_bestseller=True)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


@api_view(['POST'])
def create_order(request):
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(
            {'message': 'Commande créée avec succès!', 'order_id': order.id},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def subscribe_newsletter(request):
    serializer = NewsletterSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        subscriber, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if created:
            return Response(
                {'message': 'Merci pour votre inscription!'},
                status=status.HTTP_201_CREATED
            )
        else:
            subscriber.is_active = True
            subscriber.save()
            return Response(
                {'message': 'Vous êtes déjà inscrit(e)!'},
                status=status.HTTP_200_OK
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
