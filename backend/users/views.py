from django.http import FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, StudentProfile, CompanyProfile, AdministrationProfile
import bcrypt
import re
from rest_framework_simplejwt.tokens import RefreshToken
from .middleware import get_user_from_token
import os
from django.conf import settings
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt

@api_view(['POST'])
def register(request):
    data = request.data

    #check if required fileds
    if not data.get('full_name') or not data.get('email') or not data.get('password') or not data.get('role'):
        return Response({'error':'Please fill all required fields'}, status= status.HTTP_400_BAD_REQUEST)
    # block administration registration
    if data.get('role') == 'administration':
       return Response({'error': 'Administration accounts are pre-created by the platform. Please login directly.'}, status=status.HTTP_400_BAD_REQUEST)

    #check confirm password
    if data.get('password') != data.get('confirm_password'):
        return Response({'error':'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    

    # check if email already exists 
    if User.objects(email=data['email']).first():
        return Response({'error':'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    

    #check student specific rules
    if data['role'] == 'student':
        student_type = data.get('student_type')
        if not student_type:
            return Response({'error':'Please select your student type'} , status=status.HTTP_400_BAD_REQUEST)
        
        if student_type == 'university':
            #check university email pattern

            pattern = r'^[a-zA-Z0-9._%+-]+@(univ-[a-zA-Z0-9-]+|[a-zA-Z0-9-]+)\.dz$'
            if not re.match(pattern, data['email']):
                return Response({'error':'Please use your university email'}, status=status.HTTP_400_BAD_REQUEST)
            

            #first check : check if university has account on platform 
            student_domain = data['email'].split('@')[1]
            university_name = student_domain.split('.')[0]
            admin_exists = User.objects(
                role='administration',
                email__contains=university_name
            ).first()

            if not admin_exists:
                return Response({'error':'Your university does not have an account in our platform yet'}, status=status.HTTP_400_BAD_REQUEST)

    elif data['role'] == 'administration':
        # adminisration must use university email
        pattern= r'^[a-zA-Z0-9._%+-]+@(univ-[a-zA-Z0-9-]+|[a-zA-Z0-9-]+)\.dz$'
        if not re.match(pattern, data['email']):
            return Response({'error':'Administration mus use university email'}, status=status.HTTP_400_BAD_REQUEST)
    # hash password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
   
    # generate 6 digit verification code
    import random 
    verification_code = str(random.randint(100000, 999999))

    # create user(not verified yet)
    user = User(
        full_name=data['full_name'],
        email=data['email'],
        password=hashed_password.decode('utf-8'),
        role=data['role'],
        phone=data.get('phone', ''),
        student_type=data.get('student_type', ''),
        student_card_id = data.get('student_card_id', ''),
        director_full_name= data.get('director_full_name', ''),
        director_email= data.get('director_email', ''),
        director_phone= data.get('director_phone', ''),
        is_verified=False,
        verification_code=verification_code
    )
    user.save()

    # automatically create profile based on role 
    if data['role'] == 'student':
        StudentProfile(user_id=str(user.id)).save()
    elif data['role'] == 'company':
       CompanyProfile(
           user_id=str(user.id),
           director_full_name=data.get('director_full_name', ''),
              director_email=data.get('director_email', ''),
                director_phone=data.get('director_phone', '')
       ).save()
    elif data['role'] == 'administration':
        AdministrationProfile(
            user_id=str(user.id),
            director_full_name=data.get('director_full_name', ''),
            director_email=data.get('director_email', ''),
            director_phone=data.get('director_phone', '')
        ).save()

    #send verification email 
    send_mail(
        subject='Your Stag.io verification code',
        message=f'''
        Dear {data['full_name']},
        Welcome to Stag.io!

        Your verification code is: {verification_code}
        Please enter this code in the platform to activate your account.
        This code is valid for 10 minutes.

        Best regards,
        Stagio Platform
                     ''',
                     from_email=settings.DEFAULT_FROM_EMAIL,
                     recipient_list=[data['email']],
                     fail_silently=True,
    )
    return Response({'message':'Registration successful! Please check your email for the verification code,',
                      'user_id': str(user.id) }, status=status.HTTP_201_CREATED)            


@api_view(['POST'])
def verify_email(request):
    data = request.data

    #check rewuired fields 
    if not data.get('user_id') or not data.get('code'):
        return Response({'error':'Please provide user_id and code'}, status=status.HTTP_400_BAD_REQUEST)
    
    # find user 
    user = User.objects(id=data['user_id']).first()
    if not user : 
        return Response({'error':'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # check if already verified
    if user.is_verified:
        return Response({'error':'Account already verified'}, status=status.HTTP_400_BAD_REQUEST)
    
    #check verification code
    if user.verification_code != data['code']:
        return Response({'error':'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)
    
    # activate account 
    user.is_verified = True
    user.verification_code =''
    user.save()

    #generate   JWT token so user goes directly to his dashboard 

    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken()
    refresh['user_id'] = str(user.id)
    refresh['role'] = user.role

    return Response({
        'message':'Email verified successfully!',
        'access':str(refresh.access_token),
        'refresh': str(refresh),
        'role': user.role,
        'user_id': str(user.id)
    }, status=status.HTTP_200_OK)

    

@api_view(['POST'])
def login(request):
    data = request.data

    user = User.objects(email=data['email']).first()
    if not user:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)
    # check if email
    if not user.is_verified:
        return Response({'error':'Please verify your email first'}, status=status.HTTP_400_BAD_REQUEST) 
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken()
    refresh['user_id'] = str(user.id)
    refresh['email'] = user.email
    refresh['role'] = user.role
    refresh['full_name'] = user.full_name

    return Response({
        'message': 'Login successful',
        'role': user.role,
        'full_name': user.full_name,
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
def student_profile(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if user.role != 'student':
        return Response({'error': 'Only students can access this profile'}, status=status.HTTP_403_FORBIDDEN)
    profile = StudentProfile.objects(user_id=str(user.id)).first()

    if request.method == 'GET':
        return Response({
            
            'full_name': user.full_name,
            'email': user.email,
            'phone': user.phone,
            'student_type': user.student_type,
            'student_card_id': user.student_card_id,
            'wilaya': profile.wilaya if profile else '',
            'bio': profile.bio if profile else '',
            'avatar_url': profile.avatar_url if profile else '',
            'cv_url': profile.cv_url if profile else '',
            'university': profile.university if profile else '',
            'major': profile.major if profile.major else '',
            'speciality': profile.speciality if profile else '',
            'graduation_year': profile.graduation_year if profile else '',
            'github_link': profile.github_link if profile else '',
            'portfolio_link': profile.portfolio_link if profile else '',
            'skills': profile.skills if profile else [],
            'languages': profile.languages if profile else [],
            'experiences': profile.experiences if profile else [],
            'certifications': profile.certifications if profile else []
            
         } )

    if request.method == 'PUT':
        data = request.data
        if profile:
            profile.wilaya = data.get('wilaya', profile.wilaya)
            profile.bio = data.get('bio', profile.bio)
            profile.university = data.get('university', profile.university)
            profile.major = data.get('major', profile.major)
            profile.speciality = data.get('speciality', profile.speciality)
            profile.graduation_year = data.get('graduation_year' , profile.graduation_year)
            profile.github_link = data.get('github_link', profile.github_link)
            profile.portfolio_link = data.get('portfolio_link', profile.portfolio_link)
            profile.skills = data.get('skills', profile.skills)
            profile.languages = data.get ('languages' , profile.languages)
            profile.experiences = data.get('experiences', profile.experiences)
            profile.certifications = data.get('certifications' , profile.certifications)
            profile.save()
        return Response({'message': 'Profile updated successfully'})


@api_view(['GET', 'PUT'])
def company_profile(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role != 'company':
        return Response({'error': 'Only companies can access this'}, status=status.HTTP_403_FORBIDDEN)

    profile = CompanyProfile.objects(user_id=str(user.id)).first()

    if request.method == 'GET':
        return Response({
            'email': user.email,
            'phone': user.phone,
            'director_full_name': user.director_full_name,
            'director_email': user.director_email,
            'director_phone': user.director_phone,
            'company_name': profile.company_name if profile else '',
            'description': profile.description if profile else '',
            'logo_url': profile.logo_url if profile else '',
            'wilaya': profile.wilaya if profile else '',
            'address': profile.address if profile else '',
            'website': profile.website if profile else '',
            'industry': profile.industry if profile else '',
            'phone': profile.phone if profile else '',
            'director_full_name': profile.director_full_name if profile else '',
            'director_email': profile.director_email if profile else '',
            'director_phone': profile.director_phone if profile else '',
        })

    elif request.method == 'PUT':
        data = request.data
        if profile:
            profile.company_name = data.get('company_name', profile.company_name)
            profile.description = data.get('description', profile.description)
            profile.wilaya = data.get('wilaya', profile.wilaya)
            profile.address = data.get('address', profile.address)
            profile.website = data.get('website', profile.website)
            profile.industry = data.get('industry', profile.industry)
            profile.phone = data.get('phone', profile.phone)
            profile.director_full_name = data.get('director_full_name', profile.director_full_name)
            profile.director_email = data.get('director_email', profile.director_email)
            profile.director_phone = data.get('director_phone', profile.director_phone)
            profile.save()
        return Response({'message': 'Company profile updated successfully'})
    


@api_view(['GET', 'PUT'])
def administration_profile(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role != 'administration':
        return Response({'error': 'Only administration can access this'}, status=status.HTTP_403_FORBIDDEN)

    profile = AdministrationProfile.objects(user_id=str(user.id)).first()

    if request.method == 'GET':
        return Response({
            'email': user.email,
            'phone': user.phone,
            'director_full_name': user.director_full_name,
            'director_email': user.director_email,
            'director_phone': user.director_phone,
            'university': profile.university if profile else '',
            'wilaya': profile.wilaya if profile else '',
            'location': profile.location if profile else '',
            'logo_url': profile.logo_url if profile else '',
            'director_full_name': profile.director_full_name if profile else '',
            'director_email': profile.director_email if profile else '',
            'director_phone': profile.director_phone if profile else '',
        })

    elif request.method == 'PUT':
        data = request.data
        if profile:
            profile.university = data.get('university', profile.university)
            profile.wilaya = data.get('wilaya', profile.wilaya)
            profile.location = data.get('location', profile.location)
            profile.director_full_name = data.get('director_full_name', profile.director_full_name)
            profile.director_email = data.get('director_email', profile.director_email)
            profile.director_phone = data.get('director_phone', profile.director_phone)
            profile.save()
        return Response({'message': 'Administration profile updated successfully'})
    


@api_view(['POST'])
def upload_avatar(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if 'avatar' not in request.FILES:
        return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

    avatar = request.FILES['avatar']

    if not avatar.name.endswith(('.jpg', '.jpeg', '.png')):
        return Response({'error': 'Only jpg and png images are allowed'}, status=status.HTTP_400_BAD_REQUEST)

    avatars_dir = os.path.join(settings.MEDIA_ROOT, 'avatars')
    os.makedirs(avatars_dir, exist_ok=True)
    filename = f"avatar_{str(user.id)}{os.path.splitext(avatar.name)[1]}"
    filepath = os.path.join(avatars_dir, filename)

    with open(filepath, 'wb+') as f:
        for chunk in avatar.chunks():
            f.write(chunk)

    avatar_url = f'/media/avatars/{filename}'

    if user.role == 'student':
        profile = StudentProfile.objects(user_id=str(user.id)).first()
        if profile:
            profile.avatar_url = avatar_url
            profile.save()
    elif user.role == 'administration':
        profile = AdministrationProfile.objects(user_id=str(user.id)).first()
        if profile:
            profile.logo_url = avatar_url
            profile.save()

    return Response({'message': 'Avatar uploaded successfully', 'avatar_url': avatar_url})


@api_view(['POST'])
def upload_logo(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error':'Unauthorized'} , status=status.HTTP_401_UNAUTHORIZED)
    if user.role != 'company':
        return Response({'error':'Only companies can upload logos'}, status=status.HTTP_403_FORBIDDEN)
    
    if 'logo' not in request.FILES:
        return Response({'error':'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    logo = request.FILES['logo']

    if not logo.name.endswith(('.jpg', '.jpeg', '.png')):
        return Response({'error':'Only jpg and png images are allowed'}, status=status.HTTP_400_BAD_REQUEST)
    
    logo_dir = os.path.join(settings.MEDIA_ROOT, 'logo')
    os.makedirs(logo_dir, exist_ok=True)
    filename= f"logo_{str(user.id)}{os.path.splitext(logo.name)[1]}"
    filepath = os.path.join(logo_dir , filename)


    with open(filepath,'wb+') as f:
        for chunk in logo.chunks():
            f.write(chunk)

    logo_url = f'/media/logo/{filename}'


    if user.role == 'company':
        profile = CompanyProfile.objects(user_id= str(user.id)).first()
        if profile:
            profile.logo_url = logo_url
            profile.save()

    return Response({'message': 'Logo uploaded successfully', 'logo_url': logo_url})

@api_view(['GET'])
def public_company_profile(request, company_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error':'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    company = User.objects(id=company_id, role='company').first()
    if not company:
        return Response({'error':'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    
    company_profile = CompanyProfile.objects(user_id=company_id).first()

    return Response({
        'company_id': str(company.id),
        'full_name':company.full_name,
        'email': company.email,
        'phone': company.phone,
        'company_name': company_profile.company_name if company_profile else '',
        'description': company_profile.description if company_profile else '',
        'logo_url': company_profile.logo_url if company_profile else '',
        'wilaya': company_profile.wilaya if company_profile else '',
        'address': company_profile.address if company_profile else '',
        'website': company_profile.website if company_profile else '',
        'industry': company_profile.industry if company_profile else '',
        'director_full_name': company_profile.director_full_name if company_profile else '',
        'director_email': company_profile.director_email if company_profile else '',    
        'director_phone': company_profile.director_phone if company_profile else '',
    })

@api_view(['GET'])
def public_student_profile(request, student_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error':'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED   )    
    student = User.objects(id=student_id , role='student').first()

    if not student:
        return Response({'error':'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    student_profile = StudentProfile.objects(user_id=student_id).first()

    return Response({
        'student_id': str(student.id),
        'full_name': student.full_name,
        'email': student.email,
        'phone':student.phone,
        'student_type': student.student_type,
        'student_card_id': student.student_card_id,
        'major': student_profile.major if student_profile else '',
        'speciality': student_profile.speciality if student_profile else '',
        'university': student_profile.university if student_profile else '',
        'wilaya': student_profile.wilaya if student_profile else '',
        'skills': student_profile.skills if student_profile else [],
        'github_link': student_profile.github_link if student_profile else '',
        'portfolio_link': student_profile.portfolio_link if student_profile else '',
        'bio': student_profile.bio if student_profile else '',
        'avatar_url': student_profile.avatar_url if student_profile else '',
        'cv_url': student_profile.cv_url if student_profile else '',
    })

@api_view(['GET'])
def public_administration_profile(request, administration_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error':'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    administration = User.objects(id=administration_id , role='administration').first()
    if not administration:
        return Response({'error':'Administration not found'}, status=status.HTTP_404_NOT_FOUND)
    
    administration_profile = AdministrationProfile.objects(user_id=administration_id).first()

    return Response({
        'administration_id': str(administration.id),
        'full_name': administration.full_name,
        'email': administration.email,
        'university': administration_profile.university if administration_profile else '',
        'wilaya': administration_profile.wilaya if administration_profile else '',
        'location': administration_profile.location if administration_profile else '',
        'logo_url': administration_profile.logo_url if administration_profile else '',
        'director_full_name': administration_profile.director_full_name if administration_profile else '',
        'director_email': administration_profile.director_email if administration_profile else '',      
        'director_phone': administration_profile.director_phone if administration_profile else '',
    })


@api_view(['POST', 'PUT'])
def save_cv(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role != 'student':
        return Response({'error': 'Only students can save CV'}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    profile = StudentProfile.objects(user_id=str(user.id)).first()

    if not profile:
        profile = StudentProfile(user_id=str(user.id))

    # save CV data
    profile.bio = data.get('bio', profile.bio)
    profile.university = data.get('university', profile.university)
    profile.major = data.get('major', profile.major)
    profile.speciality = data.get('speciality', profile.speciality)
    profile.graduation_year = data.get('graduation_year', profile.graduation_year)
    profile.github_link = data.get('github_link', profile.github_link)
    profile.portfolio_link = data.get('portfolio_link', profile.portfolio_link)
    profile.skills = data.get('skills', profile.skills)
    profile.languages = data.get('languages', profile.languages)
    profile.experiences = data.get('experiences', profile.experiences)
    profile.certifications = data.get('certifications', profile.certifications)
    profile.save()

    # generate PDF CV
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.lib.units import cm

    cvs_dir = os.path.join(settings.BASE_DIR, 'media', 'cvs')
    os.makedirs(cvs_dir, exist_ok=True)

    filename = f"cv_{str(user.id)}.pdf"
    filepath = os.path.join(cvs_dir, filename)

    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4

    # header background
    c.setFillColor(colors.HexColor('#2C3E50'))
    c.rect(0, height - 5.5*cm, width, 5.5*cm, fill=True, stroke=False)

    # student name
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(2*cm, height - 2*cm, user.full_name.upper())

    # speciality under name
    c.setFont("Helvetica", 13)
    c.drawString(2*cm, height - 2.8*cm, profile.speciality if profile.speciality else '')

    # contact info
    c.setFont("Helvetica", 10)
    contact_y = height - 3.8*cm
    c.drawString(2*cm, contact_y, f"Email: {user.email}")
    c.drawString(2*cm, contact_y - 0.6*cm, f"Phone: {user.phone}")
    c.drawString(10*cm, contact_y, f"Wilaya: {profile.wilaya if profile.wilaya else ''}")
    c.drawString(10*cm, contact_y - 0.6*cm, f"University: {profile.university if profile.university else ''}")

    current_y = height - 6.5*cm

    # about me section
    if profile.bio:
        c.setFillColor(colors.HexColor('#2C3E50'))
        c.setFont("Helvetica-Bold", 13)
        c.drawString(2*cm, current_y, "ABOUT ME")
        current_y -= 0.4*cm
        c.setFillColor(colors.HexColor('#2C3E50'))
        c.rect(2*cm, current_y, width - 4*cm, 0.05*cm, fill=True, stroke=False)
        current_y -= 0.6*cm
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 10)

        # wrap bio text
        words = profile.bio.split()
        line = ''
        for word in words:
            if c.stringWidth(line + word, "Helvetica", 10) < (width - 4*cm):
                line += word + ' '
            else:
                c.drawString(2*cm, current_y, line)
                current_y -= 0.5*cm
                line = word + ' '
        if line:
            c.drawString(2*cm, current_y, line)
            current_y -= 0.8*cm

    # education section
    c.setFillColor(colors.HexColor('#2C3E50'))
    c.setFont("Helvetica-Bold", 13)
    c.drawString(2*cm, current_y, "EDUCATION")
    current_y -= 0.4*cm
    c.rect(2*cm, current_y, width - 4*cm, 0.05*cm, fill=True, stroke=False)
    current_y -= 0.6*cm
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    c.drawString(2*cm, current_y, f"University: {profile.university if profile.university else ''}")
    current_y -= 0.5*cm
    c.drawString(2*cm, current_y, f"Major: {profile.major if profile.major else ''}   |   Speciality: {profile.speciality if profile.speciality else ''}")
    current_y -= 0.5*cm
    c.drawString(2*cm, current_y, f"Graduation Year: {profile.graduation_year if profile.graduation_year else ''}")
    current_y -= 0.8*cm

    # skills section
    if profile.skills:
        c.setFillColor(colors.HexColor('#2C3E50'))
        c.setFont("Helvetica-Bold", 13)
        c.drawString(2*cm, current_y, "SKILLS")
        current_y -= 0.4*cm
        c.rect(2*cm, current_y, width - 4*cm, 0.05*cm, fill=True, stroke=False)
        current_y -= 0.6*cm
        for skill in profile.skills:
            skill_name = skill.get('name', '') if isinstance(skill, dict) else str(skill)
            skill_pct = skill.get('percentage', 0) if isinstance(skill, dict) else 0
            c.setFillColor(colors.black)
            c.setFont("Helvetica", 10)
            c.drawString(2*cm, current_y, skill_name)
            # draw percentage bar background
            c.setFillColor(colors.HexColor('#DDDDDD'))
            c.rect(7*cm, current_y - 0.1*cm, 8*cm, 0.35*cm, fill=True, stroke=False)
            # draw percentage bar fill
            c.setFillColor(colors.HexColor('#2C3E50'))
            c.rect(7*cm, current_y - 0.1*cm, 8*cm * skill_pct / 100, 0.35*cm, fill=True, stroke=False)
            # percentage text
            c.setFillColor(colors.black)
            c.drawString(15.5*cm, current_y, f"{skill_pct}%")
            current_y -= 0.6*cm
        current_y -= 0.3*cm

    # languages section
    if profile.languages:
        c.setFillColor(colors.HexColor('#2C3E50'))
        c.setFont("Helvetica-Bold", 13)
        c.drawString(2*cm, current_y, "LANGUAGES")
        current_y -= 0.4*cm
        c.rect(2*cm, current_y, width - 4*cm, 0.05*cm, fill=True, stroke=False)
        current_y -= 0.6*cm
        for lang in profile.languages:
            lang_name = lang.get('name', '') if isinstance(lang, dict) else str(lang)
            lang_pct = lang.get('percentage', 0) if isinstance(lang, dict) else 0
            c.setFillColor(colors.black)
            c.setFont("Helvetica", 10)
            c.drawString(2*cm, current_y, lang_name)
            c.setFillColor(colors.HexColor('#DDDDDD'))
            c.rect(7*cm, current_y - 0.1*cm, 8*cm, 0.35*cm, fill=True, stroke=False)
            c.setFillColor(colors.HexColor('#2C3E50'))
            c.rect(7*cm, current_y - 0.1*cm, 8*cm * lang_pct / 100, 0.35*cm, fill=True, stroke=False)
            c.setFillColor(colors.black)
            c.drawString(15.5*cm, current_y, f"{lang_pct}%")
            current_y -= 0.6*cm
        current_y -= 0.3*cm

    # experiences section
    if profile.experiences:
        c.setFillColor(colors.HexColor('#2C3E50'))
        c.setFont("Helvetica-Bold", 13)
        c.drawString(2*cm, current_y, "EXPERIENCES")
        current_y -= 0.4*cm
        c.rect(2*cm, current_y, width - 4*cm, 0.05*cm, fill=True, stroke=False)
        current_y -= 0.6*cm
        for exp in profile.experiences:
            title = exp.get('title', '') if isinstance(exp, dict) else str(exp)
            company = exp.get('company', '') if isinstance(exp, dict) else ''
            duration = exp.get('duration', '') if isinstance(exp, dict) else ''
            description = exp.get('description', '') if isinstance(exp, dict) else ''
            c.setFillColor(colors.black)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(2*cm, current_y, f"{title} @ {company} - {duration}")
            current_y -= 0.5*cm
            c.setFont("Helvetica", 10)
            c.drawString(2*cm, current_y, description)
            current_y -= 0.7*cm
        current_y -= 0.3*cm

    # certifications section
    if profile.certifications:
        c.setFillColor(colors.HexColor('#2C3E50'))
        c.setFont("Helvetica-Bold", 13)
        c.drawString(2*cm, current_y, "CERTIFICATIONS")
        current_y -= 0.4*cm
        c.rect(2*cm, current_y, width - 4*cm, 0.05*cm, fill=True, stroke=False)
        current_y -= 0.6*cm
        for cert in profile.certifications:
            c.setFillColor(colors.black)
            c.setFont("Helvetica", 10)
            c.drawString(2*cm, current_y, f"• {cert}")
            current_y -= 0.5*cm
        current_y -= 0.3*cm

    # links section
    if profile.github_link or profile.portfolio_link:
        c.setFillColor(colors.HexColor('#2C3E50'))
        c.setFont("Helvetica-Bold", 13)
        c.drawString(2*cm, current_y, "LINKS")
        current_y -= 0.4*cm
        c.rect(2*cm, current_y, width - 4*cm, 0.05*cm, fill=True, stroke=False)
        current_y -= 0.6*cm
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 10)
        if profile.github_link:
            c.drawString(2*cm, current_y, f"Github: {profile.github_link}")
            current_y -= 0.5*cm
        if profile.portfolio_link:
            c.drawString(2*cm, current_y, f"Portfolio: {profile.portfolio_link}")

    c.save()

    # save cv_url in profile
    profile.cv_url = f'/media/cvs/{filename}'
    profile.save()

    return Response({
        'message': 'CV saved and generated successfully!',
        'cv_url': f'/media/cvs/{filename}'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_cv(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role != 'student':
        return Response({'error': 'Only students can access this'}, status=status.HTTP_403_FORBIDDEN)

    profile = StudentProfile.objects(user_id=str(user.id)).first()
    if not profile:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'bio': profile.bio,
        'university': profile.university,
        'major': profile.major,
        'speciality': profile.speciality,
        'graduation_year': profile.graduation_year,
        'github_link': profile.github_link,
        'portfolio_link': profile.portfolio_link,
        'skills': profile.skills,
        'languages': profile.languages,
        'experiences': profile.experiences,
        'certifications': profile.certifications,
        'cv_url': profile.cv_url,
    })


@api_view(['GET'])
def download_cv(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role != 'student':
        return Response({'error': 'Only students can download their own CV'}, status=status.HTTP_403_FORBIDDEN)

    profile = StudentProfile.objects(user_id=str(user.id)).first()
    if not profile or not profile.cv_url:
        return Response({'error': 'CV not found, please generate your CV first'}, status=status.HTTP_404_NOT_FOUND)

    filepath = os.path.join(settings.BASE_DIR, profile.cv_url.lstrip('/'))
    if not os.path.exists(filepath):
        return Response({'error': 'CV file not found'}, status=status.HTTP_404_NOT_FOUND)

    return FileResponse(open(filepath, 'rb'), content_type='application/pdf')


@api_view(['GET'])
def download_student_cv(request, student_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role == 'student':
        return Response({'error': 'Students cannot download other students CV'}, status=status.HTTP_403_FORBIDDEN)

    student = User.objects(id=student_id, role='student').first()
    if not student:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    profile = StudentProfile.objects(user_id=student_id).first()
    if not profile or not profile.cv_url:
        return Response({'error': 'This student has not generated a CV yet'}, status=status.HTTP_404_NOT_FOUND)

    filepath = os.path.join(settings.BASE_DIR, profile.cv_url.lstrip('/'))
    if not os.path.exists(filepath):
        return Response({'error': 'CV file not found'}, status=status.HTTP_404_NOT_FOUND)

    return FileResponse(open(filepath, 'rb'), content_type='application/pdf')