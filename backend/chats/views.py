from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Message
from users.middleware import get_user_from_token
from users.models import User
from applications.models import Application

@api_view(['POST'])
def send_message(request, application_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role == 'administration':
        return Response({'error': 'Administration cannot send messages'}, status=status.HTTP_403_FORBIDDEN)

    # get application
    application = Application.objects(id=application_id).first()
    if not application:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    # check if user is allowed to chat
    if user.role == 'student':
        # student must be the one who applied
        if application.student_id != str(user.id):
            return Response({'error': 'You are not authorized to chat in this application'}, status=status.HTTP_403_FORBIDDEN)

        # check status based on student type
        student = User.objects(id=application.student_id).first()
        if student.student_type == 'university' and application.status != 'validated':
            return Response({'error': 'You can only chat after your internship is validated by the university'}, status=status.HTTP_403_FORBIDDEN)
        if student.student_type == 'independent' and application.status != 'accepted':
            return Response({'error': 'You can only chat after your application is accepted'}, status=status.HTTP_403_FORBIDDEN)

        receiver_id = application.company_id

    elif user.role == 'company':
        # company must own this application
        if application.company_id != str(user.id):
            return Response({'error': 'You are not authorized to chat in this application'}, status=status.HTTP_403_FORBIDDEN)

        # check status based on student type
        student = User.objects(id=application.student_id).first()
        if student.student_type == 'university' and application.status != 'validated':
            return Response({'error': 'You can only chat after the internship is validated by the university'}, status=status.HTTP_403_FORBIDDEN)
        if student.student_type == 'independent' and application.status != 'accepted':
            return Response({'error': 'You can only chat after accepting the application'}, status=status.HTTP_403_FORBIDDEN)

        receiver_id = application.student_id

    # get message content
    content = request.data.get('content')
    if not content:
        return Response({'error': 'Message content is required'}, status=status.HTTP_400_BAD_REQUEST)

    # save message
    message = Message(
        sender_id=str(user.id),
        receiver_id=receiver_id,
        application_id=application_id,
        content=content,
    )
    message.save()

    return Response({
        'message': 'Message sent successfully!',
        'data': {
            'id': str(message.id),
            'sender_id': str(user.id),
            'receiver_id': receiver_id,
            'content': content,
            'is_read': False,
            'created_at': str(message.created_at)
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_messages(request, application_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    application = Application.objects(id=application_id).first()
    if not application:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    # check if user belongs to this application
    if user.role == 'student' and application.student_id != str(user.id):
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    if user.role == 'company' and application.company_id != str(user.id):
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    # get all messages for this application
    messages = Message.objects(application_id=application_id).order_by('created_at')

    # mark messages as read
    for msg in messages:
        if msg.receiver_id == str(user.id) and not msg.is_read:
            msg.is_read = True
            msg.save()

    result = []
    for msg in messages:
        sender = User.objects(id=msg.sender_id).first()
        result.append({
            'id': str(msg.id),
            'sender_id': msg.sender_id,
            'sender_name': sender.full_name if sender else '',
            'sender_role': sender.role if sender else '',
            'receiver_id': msg.receiver_id,
            'content': msg.content,
            'is_read': msg.is_read,
            'created_at': str(msg.created_at)
        })

    return Response(result)


@api_view(['GET'])
def get_conversations(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role == 'administration':
        return Response({'error': 'Administration has no conversations'}, status=status.HTTP_403_FORBIDDEN)

    # get all applications related to this user
    if user.role == 'student':
        applications = Application.objects(student_id=str(user.id))
    elif user.role == 'company':
        applications = Application.objects(company_id=str(user.id))

    result = []
    for app in applications:
        # check if there are messages for this application
        messages = Message.objects(application_id=str(app.id))
        if not messages:
            continue

        # get last message
        last_message = Message.objects(application_id=str(app.id)).order_by('-created_at').first()

        # get unread count
        unread_count = Message.objects(
            application_id=str(app.id),
            receiver_id=str(user.id),
            is_read=False
        ).count()

        # get other user info
        if user.role == 'student':
            other_user = User.objects(id=app.company_id).first()
            from users.models import CompanyProfile
            other_profile = CompanyProfile.objects(user_id=app.company_id).first()
            other_name = other_profile.company_name if other_profile and other_profile.company_name else other_user.full_name if other_user else ''
        else:
            other_user = User.objects(id=app.student_id).first()
            other_name = other_user.full_name if other_user else ''

        result.append({
            'application_id': str(app.id),
            'other_user_id': str(other_user.id) if other_user else '',
            'other_user_name': other_name,
            'last_message': last_message.content if last_message else '',
            'last_message_time': str(last_message.created_at) if last_message else '',
            'unread_count': unread_count,
            'application_status': app.status,
        })

    return Response(result)


@api_view(['PUT'])
def mark_as_read(request, message_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    message = Message.objects(id=message_id, receiver_id=str(user.id)).first()
    if not message:
        return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

    message.is_read = True
    message.save()

    return Response({'message': 'Message marked as read'})