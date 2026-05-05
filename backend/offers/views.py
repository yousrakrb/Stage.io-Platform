from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Offer
from users.middleware import get_user_from_token

@api_view(['POST'])
def create_offer(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if user.role != 'company':
        return Response({'error': 'Only companies can create offers'}, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data
    try:
        offer = Offer(
            company_id=str(user.id),
            title=data.get('title'),
            description=data.get('description'),
            required_skills=data.get('required_skills', []),
            wilaya=data.get('wilaya'),
            type=data.get('type'),
            duration=data.get('duration')
        )
        offer.save()
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # notify all students who follow this comapny 
    from follows.models import Follow
    from notifications.models import Notification
    from users.models import CompanyProfile, User as UserModel
    from django.core.mail import send_mail
    from django.conf import settings
    
    try:
        company_profile = CompanyProfile.objects(user_id=str(user.id)).first()
        company_name = company_profile.company_name if company_profile else user.full_name
        followers = Follow.objects(company_id=str(user.id))
        
        for follow in followers:
            try:
                # notification in the dashboard 
                Notification(
                    recipient_id=follow.student_id,
                    type='new_offer',
                    application_id=str(offer.id),
                    message=f'{company_name} posted a new offer: {offer.title}'
                ).save()

                # send mail to student 
                student = UserModel.objects(id=follow.student_id).first()
                if student and student.email:
                    send_mail(
                        subject=f'New Offer Posted from {company_name}!',
                        message=f'''
                        Dear {student.full_name},
                        Good news! {company_name}, a company you follow on Stag.io,
                        has just published a new internship offer:
                        Offer: {offer.title}
                        Duration: {offer.duration}
                        Wilaya: {offer.wilaya}

                        Login to Stag.io to see the full details and apply!

                        Best regards,
                        Stagio Platform 
                        ''',
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[student.email],
                        fail_silently=True,
                    )   
            except Exception as e:
                print(f"Error notifying follower {follow.student_id}: {e}")
    except Exception as e:
        print(f"Error in notification logic: {e}")
    

    return Response({'message': 'Offer created successfully', 'offer_id': str(offer.id)}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_offers(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED) 
    if user.role != 'student':
        return Response({'error': 'Only students can brose offers'}, status=status.HTTP_403_FORBIDDEN)  
     
    wilaya = request.GET.get('wilaya')
    skill = request.GET.get('skill')
    type = request.GET.get('type')

    offers = Offer.objects(is_active=True)

    if wilaya:
        offers = offers.filter(wilaya=wilaya)
    if type:
        offers = offers.filter(type=type)   
    if skill:
        offers = offers.filter(required_skills=skill)


    result = []
    for offer in offers:
        result.append({
            'id': str(offer.id),
            'company_id': offer.company_id,
            'title': offer.title,
            'description': offer.description,
            'required_skills': offer.required_skills,
            'wilaya': offer.wilaya,
            'type': offer.type,
            'duration': offer.duration,
            'created_at': str(offer.created_at)
        })
    return Response(result)


@api_view(['PUT'])
def update_offer(request, offer_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    offer = Offer.objects(id=offer_id , company_id=str(user.id)).first()
   
    if not offer:
        return Response({'error': 'Offer not found or you do not have permission to edit this offer'}, status=status.HTTP_404_NOT_FOUND)
    
    data = request.data
    offer.title = data.get('title', offer.title)
    offer.description = data.get('description', offer.description)
    offer.required_skills = data.get('required_skills', offer.required_skills)
    offer.wilaya = data.get('wilaya', offer.wilaya)
    offer.type = data.get('type', offer.type)
    offer.duration = data.get('duration', offer.duration)
    offer.save()

    return Response({'message': 'Offer updated successfully'})


@api_view(['DELETE'])
def delete_offer(request, offer_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    offer = Offer.objects(id=offer_id , company_id=str(user.id)).first()
   
    if not offer:
        return Response({'error': 'Offer not found or you do not have permission to delete this offer'}, status=status.HTTP_404_NOT_FOUND)
    
    offer.delete()
    return Response({'message': 'Offer deleted successfully'})

@api_view(['GET'])
def get_my_offers(request):
    user = get_user_from_token(request)
    if not user or user.role != 'company':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    offers = Offer.objects(company_id=str(user.id))
    result = []
    for offer in offers:
        result.append({
            'id': str(offer.id),
            'title': offer.title,
            'description': offer.description,
            'required_skills': offer.required_skills,
            'wilaya': offer.wilaya,
            'type': offer.type,
            'duration': offer.duration,
            'created_at': str(offer.created_at)
        })
    return Response(result)