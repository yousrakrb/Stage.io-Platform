from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework import status
from .models import Follow
from users.middleware import get_user_from_token
from users.models import User 
from notifications.models import Notification 
 
 #student clicks on the bell to follow a company profile
@api_view(['POST'])
def follow_company(request, company_id):
    user = get_user_from_token(request)
    if not user :
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if user.role != 'student':
        return Response({'error': 'Only students can follow companies'}, status=status.HTTP_403_FORBIDDEN  )
    
    # Check if the company exists
    company = User.objects(id=company_id, role='company').first()
    if not company:
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    # Check if the user is already following the company
    already_following = Follow.objects(student_id=str(user.id), company_id=company_id).first()
    if already_following:
        return Response({'error': 'You are already following this company'}, status=status.HTTP_400_BAD_REQUEST)

    #follow the company
    Follow(
        student_id = str(user.id),
        company_id = company_id
    ).save()


    return Response({'message': 'You are now following this company!'}, status=status.HTTP_201_CREATED) 


#student clicks again to unfollow 
@api_view(['DELETE'])
def unfollow_company(request, company_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED) 
    
    if user.role != 'student':
        return Response({'error': 'Only students can unfollow companies'}, status=status.HTTP_403_FORBIDDEN)
    
    # check if following 
    follow = Follow.objects(student_id=str(user.id), company_id=company_id).first()
    if not follow:
        return Response({'error': 'You are not following this company'}, status=status.HTTP_400_BAD_REQUEST )
    
    #unfollow the company 
    follow.delete()

    return Response({'message': 'You have unfollowed this company'})



#to show if the bell is on or off 
@api_view(['GET'])
def check_follow(request, company_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED) 
    
    if user.role != 'student':
        return Response({'error': 'Only students can check follow status'}, status=status.HTTP_403_FORBIDDEN)
    
    # check if following 
    follow = Follow.objects(student_id=str(user.id), company_id=company_id).first()
    return Response({'is_following':  follow is not None})


#to get the list of companies that the student is following
@api_view(['GET'])
def get_following_companies(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED) 
    
    if user.role != 'student':
        return Response({'error': 'Only students can get following companies'}, status=status.HTTP_403_FORBIDDEN)
    
    follows = Follow.objects(student_id=str(user.id))
    from users.models import CompanyProfile
    result = []
    for follow in follows:
        company = User.objects(id=follow.company_id).first()
        if company:
            company_profile = CompanyProfile.objects(user_id=follow.company.id).first()
            result.append({
                'company_id': str(company.id),
                'company_name': company_profile.company_name if company_profile else '',
                'logo_url': company_profile.logo_url if company_profile else '',
                'industry': company_profile.industry if company_profile else '',
            })
        return Response(result)