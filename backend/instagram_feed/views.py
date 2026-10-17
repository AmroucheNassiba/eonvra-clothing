import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


INSTAGRAM_API_BASE = "https://graph.instagram.com"


def get_instagram_posts(limit=12):
    """Fetch latest posts from Instagram Graph API"""
    access_token = settings.INSTAGRAM_ACCESS_TOKEN
    user_id = settings.INSTAGRAM_USER_ID

    if not access_token or not user_id:
        return None, "Instagram credentials not configured"

    fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
    url = f"{INSTAGRAM_API_BASE}/{user_id}/media"

    try:
        response = requests.get(url, params={
            'fields': fields,
            'limit': limit,
            'access_token': access_token,
        }, timeout=10)

        if response.status_code == 200:
            data = response.json()
            posts = []
            for item in data.get('data', []):
                # Get image URL (for videos, use thumbnail)
                image_url = item.get('media_url') if item.get('media_type') != 'VIDEO' else item.get('thumbnail_url')
                posts.append({
                    'id': item['id'],
                    'caption': item.get('caption', '')[:100] + '...' if item.get('caption') and len(item.get('caption', '')) > 100 else item.get('caption', ''),
                    'media_type': item.get('media_type'),
                    'image_url': image_url,
                    'permalink': item.get('permalink'),
                    'timestamp': item.get('timestamp'),
                })
            return posts, None
        else:
            return None, f"Instagram API error: {response.status_code}"

    except requests.RequestException as e:
        return None, str(e)


# Mock data for when Instagram API is not configured
MOCK_POSTS = [
    {
        'id': f'mock_{i}',
        'caption': f'EONVRA CLOTHING - Drop #{i} 🔥 #streetwear #eonvra #hoodie',
        'media_type': 'IMAGE',
        'image_url': f'https://picsum.photos/400/400?random={i+100}',
        'permalink': 'https://instagram.com/eonvra',
        'timestamp': '2026-01-01T00:00:00Z',
        'is_mock': True,
    }
    for i in range(1, 10)
]


@api_view(['GET'])
def instagram_feed(request):
    """Get Instagram feed posts"""
    limit = int(request.query_params.get('limit', 9))
    posts, error = get_instagram_posts(limit)

    if posts is None:
        # Return mock data with a notice
        return Response({
            'posts': MOCK_POSTS[:limit],
            'notice': 'Showing demo content. Configure INSTAGRAM_ACCESS_TOKEN in .env to show real posts.',
            'instagram_username': '@eonvra',
        })

    return Response({
        'posts': posts,
        'instagram_username': '@eonvra',
    })


@api_view(['GET'])
def instagram_status(request):
    """Check Instagram API connection status"""
    access_token = settings.INSTAGRAM_ACCESS_TOKEN
    if not access_token:
        return Response({
            'connected': False,
            'message': 'Instagram API not configured',
        })

    posts, error = get_instagram_posts(limit=1)
    if posts is not None:
        return Response({'connected': True, 'message': 'Instagram API connected successfully'})
    return Response({'connected': False, 'message': error})
