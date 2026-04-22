from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Notification
from users.middleware import get_user_from_token

@api_view(['GET'])
def get_notifications(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    notifications = Notification.objects(recipient_id=str(user.id)).order_by('-created_at')

    result = []
    for notif in notifications:
        result.append({
            'id': str(notif.id),
            'type': notif.type,
            'message': notif.message,
            'application_id': notif.application_id,
            'is_read': notif.is_read,
            'created_at': str(notif.created_at)
        })

    return Response(result)


@api_view(['PUT'])
def mark_as_read(request, notification_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    notification = Notification.objects(id=notification_id, recipient_id=str(user.id)).first()
    if not notification:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

    notification.is_read = True
    notification.save()

    return Response({'message': 'Notification marked as read'})


@api_view(['GET'])
def get_unread_count(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    count = Notification.objects(recipient_id=str(user.id), is_read=False).count()

    return Response({'unread_count': count})