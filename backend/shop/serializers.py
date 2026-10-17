from rest_framework import serializers
from .models import Category, Product, ProductImage, Order, OrderItem, NewsletterSubscriber


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    extra_images = ProductImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    image_hover = serializers.SerializerMethodField()
    is_on_sale = serializers.ReadOnlyField()
    current_price = serializers.ReadOnlyField()
    sizes_list = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'description',
            'price', 'sale_price', 'current_price', 'is_on_sale',
            'image', 'image_hover', 'extra_images',
            'sizes_available', 'sizes_list', 'stock',
            'is_featured', 'is_new_arrival', 'is_bestseller',
            'created_at',
        ]

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_image_hover(self, obj):
        request = self.context.get('request')
        if obj.image_hover and request:
            return request.build_absolute_uri(obj.image_hover.url)
        return None

    def get_sizes_list(self, obj):
        return [s.strip() for s in obj.sizes_available.split(',') if s.strip()]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'size', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'email', 'phone', 'address',
            'city', 'country', 'status', 'total_price',
            'notes', 'items', 'created_at',
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']
