from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from notifications import admin
from .models import Application
from offers.models import Offer
from users.models import AdministrationProfile, User
from users.middleware import get_user_from_token 
from notifications.models import Notification
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib  import colors
from reportlab.lib.units import cm
import os
from django.conf import settings
from django.http import FileResponse
import os 
from django.conf import settings
from django.core.mail import send_mail
from django.conf import settings 

#when a student clicks apply on an offer 
@api_view(['POST'])
def apply(request, offer_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if user.role != 'student':
        return Response({'error': 'Only students can apply to offers'}, status=status.HTTP_403_FORBIDDEN)
    
    #check if offers exists
    offer = Offer.objects(id=offer_id).first()
    if not offer:
        return Response({'error': 'Offer not found'}, status=status.HTTP_404_NOT_FOUND) 
    
    #check if the student has already applied to this offer
    existing = Application.objects(student_id=str(user.id), offer_id=offer_id).first()
    if existing:
        return Response({'error': 'You have already applied to this offer'}, status=status.HTTP_400_BAD_REQUEST)    
    
    application = Application(
        student_id=str(user.id),
        offer_id=offer_id,
        company_id=offer.company_id,
    )

    application.save()

    #create a notification for the company
    Notification(
        recipient_id = offer.company_id,
        type='new_application',
        application_id = str(application.id),
        message = f'{user.full_name} has applied to your offer: {offer.title}'  
    ).save()

    return Response({'message': 'Application submitted successfully'}, status=status.HTTP_201_CREATED)

#when a student whats to see all  his applications
@api_view(['GET'])
def get_my_applications(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


    if user.role != 'student':
        return Response({'error': 'Only students can view their applications'}, status=status.HTTP_403_FORBIDDEN)   
    
    applications = Application.objects(student_id=str(user.id))

    result = []
    for app in applications:
        offer = Offer.objects(id=app.offer_id).first()
        result.append({
            'id' : str(app.id),
            'offer_title': offer.title if offer else '',
            'company_id': app.company_id,
            'status': app.status,
            'applied_at': str(app.applied_at)})
        
    return Response(result)

#when a company wants to see who applied to his offer 
@api_view(['GET'])
def get_company_applications(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role != 'company':
        return Response({'error': 'Only companies can view their candidates'}, status=status.HTTP_403_FORBIDDEN)   
    
    applications = Application.objects(company_id=str(user.id))

    result = []
    for app in applications:
        student = User.objects(id=app.student_id).first()
        offer = Offer.objects(id=app.offer_id).first()
        result.append({
            'id' : str(app.id),
            'student_name': student.full_name if student else '',
            'student_email': student.email if student else '',
            'offer_title': offer.title if offer else '',
            'status': app.status,
            'applied_at': str(app.applied_at)})
        
    return Response(result)

#when a company wants to accept or refuse an application
@api_view(['PUT'])
def company_decision(request, application_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role != 'company':
        return Response({'error': 'Only companies can make decisions'}, status=status.HTTP_403_FORBIDDEN)

    application = Application.objects(id=application_id, company_id=str(user.id)).first()
    if not application:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    decision = request.data.get('decision')
    if decision not in ['accepted', 'refused']:
        return Response({'error': 'Decision must be accepted or refused'}, status=status.HTTP_400_BAD_REQUEST)

    application.status = decision
    application.company_decision_at = datetime.now()
    application.save()

    student = User.objects(id=application.student_id).first()
    offer = Offer.objects(id=application.offer_id).first()
    from users.models import CompanyProfile, StudentProfile
    company_profile = CompanyProfile.objects(user_id=str(user.id)).first()
    student_profile = StudentProfile.objects(user_id=str(student.id)).first()

    if decision == 'accepted':
        if student.student_type == 'independent':
            # generate PDF convention for independent student
            from reportlab.lib.pagesizes import A4
            from reportlab.pdfgen import canvas
            from reportlab.lib import colors
            from reportlab.lib.units import cm
            

            conventions_dir = os.path.join(settings.BASE_DIR, 'media', 'conventions')
            os.makedirs(conventions_dir, exist_ok=True)
            filename = f"convention_{str(application.id)}.pdf"
            filepath = os.path.join(conventions_dir, filename)

            c = canvas.Canvas(filepath, pagesize=A4)
            width, height = A4

            # ─── TITLE ───
            c.setFont("Helvetica-Bold", 22)
            c.drawCentredString(width/2, height - 1.8*cm, "INTERNSHIP CONVENTION")
            c.setFont("Helvetica-Bold", 16)
            c.drawCentredString(width/2, height - 2.8*cm, "BETWEEN")
            c.setLineWidth(1)
            c.line(1.5*cm, height - 3.2*cm, width - 1.5*cm, height - 3.2*cm)

            # ─── COMPANY BOX ───
            c.setLineWidth(0.8)
            c.rect(1.5*cm, height - 8*cm, width - 3*cm, 4.5*cm)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(2*cm, height - 4*cm, "Company (name and address):")
            c.setFont("Helvetica", 8)
            c.drawString(2*cm, height - 4.6*cm, f"{company_profile.company_name if company_profile and company_profile.company_name else '.................'}")
            c.drawString(2*cm, height - 5.1*cm, f"{company_profile.address if company_profile and company_profile.address else '.................'}")
            c.drawString(2*cm, height - 5.7*cm, "Represented by:")
            c.drawString(2*cm, height - 6.2*cm, f"Mr/Ms: {company_profile.director_full_name if company_profile and company_profile.director_full_name else '.................'}")
            c.drawString(2*cm, height - 6.7*cm, f"Tel: {company_profile.phone if company_profile and company_profile.phone else '.....'} Fax: ............")

            # ─── AND ───
            c.setFont("Helvetica-Bold", 14)
            c.drawCentredString(width/2, height - 9*cm, "AND")

            # ─── STUDENT INFORMATION BOX ───
            student_box_top = height - 9.6*cm
            student_box_height = 6*cm
            c.setLineWidth(1.2)
            c.rect(1.5*cm, student_box_top - student_box_height, width - 3*cm, student_box_height)

            c.setFont("Helvetica-Bold", 11)
            title_y = student_box_top - 0.7*cm
            c.drawCentredString(width/2, title_y, "STUDENT INFORMATION")
            title_width = c.stringWidth("STUDENT INFORMATION", "Helvetica-Bold", 11)
            c.setLineWidth(0.8)
            c.line(width/2 - title_width/2, title_y - 0.15*cm, width/2 + title_width/2, title_y - 0.15*cm)

            c.setFont("Helvetica", 9.5)
            field_y = student_box_top - 1.4*cm
            line_gap = 0.6*cm

            c.drawString(2*cm, field_y, f"Full Name: {student.full_name}")
            field_y -= line_gap
            c.drawString(2*cm, field_y, f"Email: {student.email}")
            field_y -= line_gap
            c.drawString(2*cm, field_y, f"Student Card N°: {student.student_card_id if student.student_card_id else '.................'}")
            c.drawString(width/2, field_y, f"Phone: {student.phone if student.phone else '.................'}")
            field_y -= line_gap
            c.drawString(2*cm, field_y, f"Speciality: {student_profile.speciality if student_profile and student_profile.speciality else '.................'}")
            field_y -= line_gap
            c.drawString(2*cm, field_y, f"Internship Theme: {offer.title if offer else '.................'}")
            field_y -= line_gap
            c.drawString(2*cm, field_y, f"Duration: {offer.duration if offer else '.................'}")
            field_y -= line_gap
            c.drawString(2*cm, field_y, "Start Date: .........................")
            c.drawString(width/2, field_y, "End Date: .........................")

            # ─── FOOTER ───
            footer_y = student_box_top - student_box_height - 0.5*cm
            c.setFont("Helvetica-Oblique", 7.5)
            c.drawString(1.5*cm, footer_y, "Established in 02 original copies: 01 copy for the company and 01 copy for the student.")
            c.setFont("Helvetica", 9)
            company_wilaya = company_profile.wilaya if company_profile and company_profile.wilaya else "................."
            c.drawRightString(width - 1.5*cm, footer_y - 0.8*cm, f"Made in {company_wilaya} on: {datetime.now().strftime('%d/%m/%Y')}")
            # ─── SIGNATURES ───
            sig_y = footer_y - 3*cm
            c.setFont("Helvetica-Bold", 10)
            c.drawString(1.5*cm, sig_y, "For the company:")
            c.drawCentredString(width/2, sig_y, "For the student:")
            c.save()

            # save convention url
            application.convention_url = f'/media/conventions/{filename}'
            application.save()

            # send email with PDF attached
            from django.core.mail import EmailMessage
            email_msg = EmailMessage(
                subject='Congratulations! Your internship application has been accepted!',
                body=f'''
Dear {student.full_name},

Congratulations! Your application for the offer "{offer.title if offer else ''}"
has been accepted by {company_profile.company_name if company_profile else 'the company'}.

Please find your convention document attached to this email.
Please contact them at: {user.email}

Best regards,
Stagio Platform
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[student.email],
            )
            email_msg.attach_file(filepath)
            email_msg.send(fail_silently=True)

        else:
            # university student → notify administration
            domain = student.email.split('@')[1]
            university_name = domain.split('.')[0]
            administration = User.objects(
                role='administration',
                email__contains=university_name
            ).first()
            
            if administration:
                Notification(
                    recipient_id=str(administration.id),
                    type='pending_validation',
                    application_id=str(application.id),
                    message=f'{student.full_name} was accepted by a company, waiting for your validation'
                ).save()

            # send email to university student
            send_mail(
                subject='Congratulations! Your internship application has been accepted!',
                message=f'''
Dear {student.full_name},

Congratulations! Your application for the offer "{offer.title if offer else ''}"
has been accepted by {company_profile.company_name if company_profile else 'the company'}.

The university administration will now review and validate your internship.
You will be notified once it is validated!

Best regards,
Stagio Platform
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[student.email],
                fail_silently=True,
            )

    elif decision == 'refused':
        if student.student_type == 'independent':
            # send refusal email to independent student
            send_mail(
                subject='Update on your internship application',
                message=f'''
Dear {student.full_name},

We regret to inform you that your application for the offer "{offer.title if offer else ''}"
has been refused by the company.

Don't give up! Keep applying to other offers on Stag.io!

Best regards,
Stagio Platform
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[student.email],
                fail_silently=True,
            )
        else:
            # university student → send notification
            Notification(
                recipient_id=application.student_id,
                type='refused',
                application_id=str(application.id),
                message='Sorry, your application has been refused by the company'
            ).save()
            # also send email to university student
            send_mail(
                subject='Update on your internship application',
                message=f'''
Dear {student.full_name},

We regret to inform you that your application for the offer "{offer.title if offer else ''}"
has been refused by the company.

Don't give up! Keep applying to other offers on Stag.io!

Best regards,
Stagio Platform
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[student.email],
                fail_silently=True,
            )

    return Response({'message': f'Application {decision} successfully'})

#when the administration wants to validate an application after being accepted by the company
@api_view(['PUT'])
def validate_application(request, application_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.role != 'administration':
        return Response({'error': 'Only administration can validate applications'}, status=status.HTTP_403_FORBIDDEN)

    application = Application.objects(id=application_id, status='accepted').first()
    if not application:
        return Response({'error': 'Application not found or not accepted yet'}, status=status.HTTP_404_NOT_FOUND)

    decision = request.data.get('decision')
    if decision not in ['validated', 'refused']:
        return Response({'error': 'Decision must be validated or refused'}, status=status.HTTP_400_BAD_REQUEST)

    if decision == 'validated':
        # get all needed data
        student = User.objects(id=application.student_id).first()
        offer = Offer.objects(id=application.offer_id).first()
        from users.models import StudentProfile, CompanyProfile, AdministrationProfile
        student_profile = StudentProfile.objects(user_id=str(student.id)).first()
        company_profile = CompanyProfile.objects(user_id=str(application.company_id)).first()

        # get administration and its profile
        domain = student.email.split('@')[1]
        university_name = domain.split('.')[0]
        administration = User.objects(role='administration', email__contains=university_name).first()
        administration_profile = AdministrationProfile.objects(user_id=str(administration.id)).first() if administration else None

        # generate PDF convention
        conventions_dir = os.path.join(settings.BASE_DIR, 'media', 'conventions')
        os.makedirs(conventions_dir, exist_ok=True)

        filename = f"convention_{str(application.id)}.pdf"
        filepath = os.path.join(conventions_dir, filename)

        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
        from reportlab.lib import colors
        from reportlab.lib.units import cm
        from datetime import datetime

        c = canvas.Canvas(filepath, pagesize=A4)
        width, height = A4

        # ─── TITLE ───
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(width/2, height - 1.8*cm, "INTERNSHIP CONVENTION")
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(width/2, height - 2.8*cm, "BETWEEN")
        c.setLineWidth(1)
        c.line(1.5*cm, height - 3.2*cm, width - 1.5*cm, height - 3.2*cm)

        # ─── TWO BOXES ───
        box_top = height - 3.5*cm
        box_height = 4.8*cm
        left_box_x = 1.5*cm
        left_box_w = (width - 3*cm) / 2 - 1*cm
        right_box_x = width/2 + 1*cm
        right_box_w = (width - 3*cm) / 2 - 1*cm

        # LEFT BOX — University
        c.setLineWidth(0.8)
        c.rect(left_box_x, box_top - box_height, left_box_w, box_height)

        uni_name = student_profile.university.upper() if student_profile and student_profile.university else "UNIVERSITY"
        c.setFont("Helvetica-Bold", 8)
        text_x = left_box_x + left_box_w/2
        c.drawCentredString(text_x, box_top - 0.5*cm, uni_name)

        director_name = administration_profile.director_full_name if administration_profile and administration_profile.director_full_name else "................."
        c.setFont("Helvetica", 7.5)
        c.drawCentredString(text_x, box_top - 1*cm, director_name)

        uni_location = administration_profile.location if administration_profile and administration_profile.location else "................."
        c.drawString(left_box_x + 0.3*cm, box_top - 1.6*cm, f"Address: {uni_location}")
        c.drawString(left_box_x + 0.3*cm, box_top - 2.1*cm, "Represented by:")
        c.drawString(left_box_x + 0.3*cm, box_top - 2.6*cm, "Mr. The Vice-Rector in charge")
        c.drawString(left_box_x + 0.3*cm, box_top - 3*cm, "of external relations,")
        c.drawString(left_box_x + 0.3*cm, box_top - 3.4*cm, "hereinafter the University")
        uni_phone = administration.phone if administration and administration.phone else "................."
        c.drawString(left_box_x + 0.3*cm, box_top - 4*cm, f"Tel/Fax: {uni_phone}")

        # AND — between boxes
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(width/2, box_top - box_height/2, "AND")

        # RIGHT BOX — Company
        c.setLineWidth(0.8)
        c.rect(right_box_x, box_top - box_height, right_box_w, box_height)

        c.setFont("Helvetica-Bold", 8)
        c.drawString(right_box_x + 0.3*cm, box_top - 0.5*cm, "Company (name and address)")
        c.setFont("Helvetica", 7.5)

        company_name_text = company_profile.company_name if company_profile and company_profile.company_name else "................."
        company_address_text = company_profile.address if company_profile and company_profile.address else "................."
        c.drawString(right_box_x + 0.3*cm, box_top - 1*cm, company_name_text)
        c.drawString(right_box_x + 0.3*cm, box_top - 1.5*cm, company_address_text)
        c.drawString(right_box_x + 0.3*cm, box_top - 2.1*cm, "Represented by:")
        director_company = company_profile.director_full_name if company_profile and company_profile.director_full_name else "................."
        c.drawString(right_box_x + 0.3*cm, box_top - 2.6*cm, f"Mr/Ms: {director_company}")
        c.drawString(right_box_x + 0.3*cm, box_top - 3.1*cm, ".................")
        company_phone_text = company_profile.phone if company_profile and company_profile.phone else "....."
        c.drawString(right_box_x + 0.3*cm, box_top - 3.7*cm, f"Tel: {company_phone_text}    Fax: ............")

        # ─── STUDENT INFORMATION BOX ───
        student_box_top = box_top - box_height - 0.6*cm
        student_box_height = 6.2*cm

        c.setLineWidth(1.2)
        c.rect(1.5*cm, student_box_top - student_box_height, width - 3*cm, student_box_height)

        c.setFont("Helvetica-Bold", 11)
        title_y = student_box_top - 0.7*cm
        c.drawCentredString(width/2, title_y, "STUDENT INFORMATION")
        title_width = c.stringWidth("STUDENT INFORMATION", "Helvetica-Bold", 11)
        c.setLineWidth(0.8)
        c.line(width/2 - title_width/2, title_y - 0.15*cm, width/2 + title_width/2, title_y - 0.15*cm)

        c.setFont("Helvetica", 9.5)
        field_y = student_box_top - 1.4*cm
        line_gap = 0.6*cm

        c.drawString(2*cm, field_y, f"Full Name and Surname:  {student.full_name}")
        field_y -= line_gap
        c.drawString(2*cm, field_y, f"Faculty / University:  {student_profile.university if student_profile and student_profile.university else '.................'}")
        field_y -= line_gap
        c.drawString(2*cm, field_y, f"Student Card N°:  {student.student_card_id if student.student_card_id else '.................'}")
        c.drawString(width/2, field_y, f"Phone:  {student.phone if student.phone else '.................'}")
        field_y -= line_gap
        c.drawString(2*cm, field_y, f"Degree Prepared:  {student_profile.major if student_profile and student_profile.major else '.................'}")
        field_y -= line_gap
        c.drawString(2*cm, field_y, f"Internship Theme:  {offer.title if offer else '.................'}")
        field_y -= line_gap
        c.drawString(2*cm, field_y, f"Duration:  {offer.duration if offer else '.................'}")
        field_y -= line_gap
        c.drawString(2*cm, field_y, "Start Date:  .........................")
        c.drawString(width/2, field_y, "End Date:  .........................")

        # ─── FOOTER NOTE ───
        footer_y = student_box_top - student_box_height - 0.5*cm
        c.setFont("Helvetica-Oblique", 8)
        c.drawString(1.5*cm, footer_y, "Established in 02 original copies: 01 copy for the university and 01 copy for the company.")

        # ─── MADE IN ───
        wilaya_text = administration_profile.wilaya if administration_profile and administration_profile.wilaya else "................."
        c.setFont("Helvetica", 9)
        c.drawRightString(width - 1.5*cm, footer_y - 0.8*cm, f"Made in {wilaya_text} on: {datetime.now().strftime('%d/%m/%Y')}")

        # ─── VISA ───
        c.setFont("Helvetica-Bold", 9)
        c.drawString(1.5*cm, footer_y - 1.8*cm, "Visa of the department head:")
        c.setLineWidth(0.5)
        c.line(1.5*cm, footer_y - 3*cm, 8*cm, footer_y - 3*cm)

        # ─── SIGNATURES ───
        sig_y = footer_y - 4.5*cm
        c.setFont("Helvetica-Bold", 10)
        c.drawString(1.5*cm, sig_y, "For the company:")
        c.drawCentredString(width/2, sig_y, "For the student:")
        c.drawRightString(width - 1.5*cm, sig_y, "For the university:")

        c.save()

        # save convention url
        application.status = 'validated'
        application.administration_validated_at = datetime.now()
        application.convention_url = f'/media/conventions/{filename}'
        application.save()

        # mark student as placed
        from users.models import StudentProfile
        student_profile_update = StudentProfile.objects(user_id=str(student.id)).first()
        if student_profile_update:
            student_profile_update.placed = True
            student_profile_update.save()

        # notify student validated
        Notification(
            recipient_id=application.student_id,
            type='validated',
            application_id=str(application.id),
            message='Congratulations! Your internship has been validated by the university administration!'
        ).save()

        # send email with PDF attached to university student
        from django.core.mail import EmailMessage
        email_msg = EmailMessage(
            subject='Congratulations! Your internship has been validated!',
            body=f'''
Dear {student.full_name},

Congratulations! Your internship application has been validated by your university administration.

Please find your convention document attached to this email.

Best regards,
Stagio Platform
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[student.email],
        )
        email_msg.attach_file(filepath)
        email_msg.send(fail_silently=True)

        return Response({
            'message': 'Application validated successfully',
            'convention_url': f'/media/conventions/{filename}'
        })

    elif decision == 'refused':
        application.status = 'refused'
        application.administration_validated_at = datetime.now()
        application.save()

        Notification(
            recipient_id=application.student_id,
            type='refused',
            application_id=str(application.id),
            message='Sorry, your internship application has been refused by the university administration'
        ).save()

        return Response({'message': 'Application refused by administration'})
#when administration opens their dashboard
@api_view(['GET'])
def get_pending_validations(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    if user.role != 'administration':
        return Response({'error': 'Only administration can view pending validations'}, status=status.HTTP_403_FORBIDDEN)
    
    #get university name from administration email
    domain = user.email.split('@')[1] if '@' in user.email else ''
    university_name = domain.split('.')[0] if domain else ''

    applications = Application.objects(status='accepted')

    result= []
    for app in applications:
        student = User.objects(id=app.student_id).first()
        if not student:
            continue

        # only show students from this university
        student_domain = student.email.split('@')[1] if '@' in student.email else ''
        student_university = student_domain.split('.')[0] if student_domain else ''

        if student_university != university_name:
            continue

        offer = Offer.objects(id=app.offer_id).first()
        from users.models import StudentProfile, CompanyProfile
        student_profile = StudentProfile.objects(user_id=str(student.id)).first()
        company_profile = CompanyProfile.objects(user_id=app.company_id).first()


        result.append({
            'id': str(app.id),
            # student full details
            'student_name': student.full_name,
            'student_email': student.email,
            'student_phone': student.phone,
            'student_university': student_profile.university if student_profile else '',
            'student_major': student_profile.major if student_profile else '',
            'student_wilaya': student_profile.wilaya if student_profile else '',
            'student_skills': student_profile.skills if student_profile else [],
            'student_github': student_profile.github_link if student_profile else '',
            'student_bio': student_profile.bio if student_profile else '',
            'student_avatar': student_profile.avatar_url if student_profile else '',
            # company full details
            'company_name': company_profile.company_name if company_profile else '',
            'company_description': company_profile.description if company_profile else '',
            'company_wilaya': company_profile.wilaya if company_profile else '',
            'company_industry': company_profile.industry if company_profile else '',
            'company_website': company_profile.website if company_profile else '',
            'company_logo': company_profile.logo_url if company_profile else '',
            # offer full details
            'offer_title': offer.title if offer else '',
            'offer_description': offer.description if offer else '',
            'offer_required_skills': offer.required_skills if offer else [],
            'offer_duration': offer.duration if offer else '',
            'offer_type': offer.type if offer else '',
            'offer_wilaya': offer.wilaya if offer else '',
            # application details
            'applied_at': str(app.applied_at),
            'company_decision_at': str(app.company_decision_at)
        })

    return Response(result)

 
        
    
@api_view(['GET'])
def get_statistics(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    

    if user.role != 'administration':
        return Response({'error':'Only administration can view statistics'}, status=status.HTTP_403_FORBIDDEN)
    
    #get university domain from the administration email
    domain = user.email.split('@')[1]

    #get only student from the same university as the administration
    university_students = User.objects(role='student', email__endswith=domain)
    student_ids = [str(s.id) for s in university_students]

    #count placed and unplaced students
    placed = Application.objects(student_id__in=student_ids, status='validated').distinct('student_id')
    total_students = len(student_ids)
    placed_count = len(placed)
    unplaced_count = total_students - placed_count

    return Response({
        'total_students': total_students,   
        'placed_students': placed_count,
        'unplaced_students': unplaced_count
    })


@api_view(['GET'])
def download_convention(request, application_id):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    
    application = Application.objects(id=application_id).first()
    if not application:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)   
    
    #only the student of this application can dowload the convention
    if str(user.id) != application.student_id:
        return Response({'error': 'Unauthoried'}, status=status.HTTP_403_FORBIDDEN)
    if not application.convention_url:
        return Response({'error': 'Convention not generated yet'}, status=status.HTTP_404_NOT_FOUND)
    
    #get the file path 
    filepath = os.path.join(settings.BASE_DIR , application.convention_url.lstrip('/'))

    if not os.path.exists(filepath):
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)  
    
    return FileResponse(open(filepath, 'rb'), content_type='application/pdf', filename = f'convention_{application_id}.pdf')