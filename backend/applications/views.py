from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Application
from offers.models import Offer
from users.models import User
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
        return Response({'error': 'Only companies can make decisions on applications'}, status=status.HTTP_403_FORBIDDEN)   
    
    application = Application.objects(id=application_id, company_id=str(user.id)).first()
    if not application:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND) 

    decision = request.data.get('decision')
    if decision not in ['accepted', 'refused']:
        return Response({'error': 'Decision must be either "accepted" or "refused"'}, status=status.HTTP_400_BAD_REQUEST) 

    application.status = decision
    application.company_decision_at = datetime.now()
    application.save()


    if decision == 'accepted':
        student = User.objects(id=application.student_id).first()

        if student.student_type == 'independent':
            #send real email to independent student
            offer = Offer.objects(id=application.offer_id).first()
            from users.models import CompanyProfile, StudentProfile
            company_profile = CompanyProfile.objects(user_id=str(user.id)).first()
            student_profile = StudentProfile.objects(user_id=str(student.id)).first()
            #generate pdf convention for independetn students
            conventions_dir = os.path.join(settings.BASE_DIR, 'media' , 'conventions') 
            os.makedirs(conventions_dir, exist_ok=True) 

            filename=f"convention_{str(application.id)}.pdf"
            filepath= os.path.join(conventions_dir, filename)

            c = canvas.Canvas(filepath, pagesize=A4)
            width, height = A4  
            
            c.setFont("Helvetica-Bold", 20)
            c.drawCentredString(width/2, height - 3*cm, "Internship Convention")

            c.setFont("Helvetica", 12)
            c.drawCentredString(width/2, height - 4*cm, "Stag.io - Internship Management Platform")                       
            
            c.line(2*cm, height - 4.5*cm, width - 2*cm, height - 4.5*cm)

            c.setFont("Helvetica-Bold", 14)
            c.drawString(2*cm, height - 6*cm, "Student Information:")
            c.setFont("Helvetica", 12)
            c.drawString(2*cm, height - 7*cm, f"Full Name: {student.full_name}")
            c.drawString(2*cm, height - 7.8*cm, f"Email: {student.email}")
            c.drawString(2*cm, height - 8.6*cm, f"Phone Number: {student.phone}")
            if student_profile:
                c.drawString(2*cm, height - 9.4*cm, f"Major: {student_profile.major}")
                c.drawString(2*cm, height - 10.2*cm, f"Wilaya: {student_profile.wilaya}")

            c.line(2*cm, height - 11*cm, width - 2*cm, height - 11*cm)
            c.setFont("Helvetica-Bold", 14)
            c.drawString(2*cm, height - 12*cm, "Company Information:")
            c.setFont("Helvetica", 12)
            if company_profile:
                c.drawString(2*cm, height - 13*cm, f"Company: {company_profile.company_name}")
                c.drawString(2*cm, height - 13.8*cm, f"Wilaya: {company_profile.wilaya}")
                c.drawString(2*cm, height - 14.6*cm, f"Industry: {company_profile.industry}")

            c.line(2*cm, height - 15.4*cm, width - 2*cm, height - 15.4*cm)

            c.setFont("Helvetica-Bold", 14)
            c.drawString(2*cm, height - 16.4*cm, "Internship Information:")
            c.setFont("Helvetica", 12)
            if offer:
                c.drawString(2*cm, height - 17.4*cm, f"Title: {offer.title}")
                c.drawString(2*cm, height - 18.2*cm, f"Duration: {offer.duration}")
                c.drawString(2*cm, height - 19*cm, f"Type: {offer.type}")
                c.drawString(2*cm, height - 19.8*cm, f"Wilaya: {offer.wilaya}")

            c.line(2*cm, height - 20.6*cm, width - 2*cm, height - 20.6*cm)

            c.setFont("Helvetica-Bold", 14)
            c.drawString(2*cm, height - 21.6*cm, "Signatures:")
            c.setFont("Helvetica", 12)
            c.drawString(2*cm, height - 23*cm, "Student Signature:  ___________________")
            c.drawString(10*cm, height - 23*cm, "Company Signature :  ___________________")

            c.save()


            # save convention url in application
            application.convention_url = f'/media/conventions/{filename}'
            application.save()

            #send email with pdf 
            from django.core.mail import EmailMessage
            email = EmailMessage(
                subject='Congratulations!!! Your internship application has been accepted ! ',
                body = f'''
    Dear {student.full_name},
    Congratulations!!! Your application for the offer "{offer.title if offer else ''}"
    has been accepted by {company_profile.company_name if company_profile else 'the company'}.

    Please find your convention document attached to this email.
    Please contact them at: {user.email}

    Best regards,
    Stag.io Platform
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[student.email],)
                

            email.attach_file(filepath)
            email.send(fail_silently=True)
            

        else:
            #university student notify administration 
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
                    message=f'{student.full_name} was accepted by a company , waiting for your validation'

                ).save()

   
    elif decision == 'refused':
        student = User.objects(id=application.student_id).first()

        if student.student_type == 'independent':
                    #send real email to independent  students
                    offer = Offer.objects(id=application.offer_id).first()
                    from users.models import CompanyProfile
                    company_profile = CompanyProfile.objects(user_id=str(user.id)).first()

                    send_mail(
                        subject='Update on your internship application',
                        message=f'''
                        Dear {student.full_name},
                        We regret to inform you that your application for the offer "{offer.title if offer else '' }"
                    has been refused by {company_profile.company_name if company_profile else 'the company'}.

                    Don't give up ! Keep applying  to other offers on Stag.io!

                    Best regards,
                    Stagio Platform
                                     ''',
                                     from_email= settings.DEFAULT_FROM_EMAIL,
                                     recipient_list=[student.email],
                                     fail_silently=True,

                    )
        else:
                    #university student notify administration
                Notification(
                            recipient_id=str(administration.id),
                            type='refused',
                            application_id=str(application.id),
                            message='Sorry, your application has been refused by the company'
                        ).save()
                #also send email to univesity students
                offer = Offer.objects(id=application.offer_id).first()
                send_mail(
                    subject='Update on your internship application',
                    message= f'''
                Dear {student.full_name},
                We regret to inform you that your application for the offer "{offer.tittle if offer else ''}
                has been refused by the company.

                Don't give up ! Keep applying to other offers on Stag.io!

                Best regards,
                Stagio Platform
                           ''',
                           from_email=settings.DEFAULT_FROM_EMAIL,
                           recipient_list=[student.emil],
                           fail_silently=True
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
    if decision not in ['validated','refused']:
        return Response({'error':'Decision must be validated or refused'}, status=status.HTTP_400_BAD_REQUEST)
    
    if decision == 'validated':

    #get student and company data for the pdf 
     student = User.objects(id=application.student_id).first()
     company_user = User.objects(id=application.company_id).first()
     offer = Offer.objects(id=application.offer_id).first()
     from users.models import StudentProfile , CompanyProfile
     student_profile = StudentProfile.objects(user_id=str(student.id)).first()
     company_profile = CompanyProfile.objects(user_id=str(application.company_id)).first()


    #create media/conventions folder if it doesn t exist
     conventions_dir = os.path.join(settings.BASE_DIR,'media','conventions')
     os.makedirs(conventions_dir,exist_ok=True)


    #generate PDF filename
     filename = f"convention_{str(application.id)}.pdf"
     filepath = os.path.join(conventions_dir, filename)

    #create PDF 
     c = canvas.Canvas(filepath,pagesize=A4)
     width, height = A4

    #title
     c.setFont("Helvetica-Bold", 20)
     c.drawCentredString (width/2 , height - 3*cm , "Internship Convention")

    #subtitle
     c.setFont("Helvetica", 12)
     c.drawCentredString (width/2 , height - 4*cm , "Stag.io - Internship Management Platform")

    # line seperator
     c.setStrokeColor(colors.black)
     c.line(2*cm, height - 4.5*cm, width - 2*cm, height - 4.5*cm)
    
    #student information
     c.setFont("Helvetica-Bold", 14)
     c.drawString(2*cm, height - 6*cm, "Student Information:")
     c.setFont("Helvetica", 12)
     c.drawString(2*cm, height - 7*cm, f"Full Name: {student.full_name}")
     c.drawString(2*cm, height - 7.8*cm, f"Email: {student.email}")
     if student_profile:
        c.drawString(2*cm, height - 8.6*cm, f"University: {student_profile.university}")
        c.drawString(2*cm, height - 9.4*cm, f"Field of Study: {student_profile.major}")
        c.drawString(2*cm, height - 10.2*cm, f"Wilaya: {student_profile.wilaya}")

    #line seperator
     c.line(2*cm, height - 11*cm, width - 2*cm, height - 11*cm)

    #company information
     c.setFont("Helvetica-Bold", 14)
     c.drawString(2*cm, height - 12*cm, "Company Information:")
     c.setFont("Helvetica", 12)
     if company_profile:
        c.drawString(2*cm, height - 13*cm, f"Company Name: {company_profile.company_name}")
        c.drawString(2*cm, height - 13.8*cm, f"Wilaya: {company_profile.wilaya}")
        c.drawString(2*cm, height - 14.6*cm, f"Industry: {company_profile.industry}")

    #line seperator
     c.line(2*cm, height - 15.4*cm, width - 2*cm, height - 15.4*cm) 

    #internship information
     c.setFont("Helvetica-Bold", 14)
     c.drawString(2*cm, height - 16.4*cm, "Internship Information:") 
     c.setFont("Helvetica", 12)
     if offer:
        c.drawString(2*cm, height - 17.4*cm, f"Offer Title: {offer.title}")
        c.drawString(2*cm, height - 18.2*cm, f"Duration: {offer.duration}")
        c.drawString(2*cm, height - 19*cm, f"Type: {offer.type}")
        c.drawString(2*cm, height - 19.6*cm, f"Wilaya: {offer.wilaya}")      
    

    #line seperator
     c.line(2*cm, height - 20.6*cm, width - 2*cm, height - 20.6*cm)

    #validation info 
     c.setFont("Helvetica-Bold", 14)
     c.drawString(2*cm, height - 21.6*cm, "Validation:")
     c.setFont("Helvetica", 12)
     c.drawString(2*cm, height - 22.6*cm, f"Validated by: {user.full_name}")
     c.drawString(2*cm, height - 23.4*cm, f"Validation Date: {datetime.now().strftime('%d/%m/%Y')}")


    #signature lines
     c.drawString(2*cm, height - 25*cm, "Student Signature: ___________________")
     c.drawString(10*cm, height - 25*cm, "Company Signature: ___________________")
     c.drawString(2*cm, height - 26.5*cm, "Administration Signature: ___________________")
     c.save()


    #save the convention path to the application
     application.status = 'validated'
     application.administration_validated_at = datetime.now()
     application.convention_url = f'/media/conventions/{filename}'
     application.save()



    #notify the student
     Notification(
         recipient_id = application.student_id,
        type = 'validated',
        application_id = str(application.id),
        message = ' Congratulations!!! Your internship application has been validated by the university administration. We wish you a successful internship experience!'
     ).save()

     #send emal with pdf attached to univesity students 
     from django.core.mail import EmailMessage
     email = EmailMessage(
         subject = 'Congratulations ! Your internship has been validated!',
         body=f'''
         Dear{student.full_name},
         Congratulations! Your internship application has been validated by your university administration.

         Please find your convention document attached to this email.

         Best regards,
         Stagio Platform
             ''',

             from_email=settings.DEFAULT_FROM_EMAIL,
             to=[student.email],  
     )

     email.attach_file(filepath)
     email.send(fail_silently=True)

     return Response({
                    'message': 'Application validated successfully',
                     'convention_url': f'/media/conventions/{filename}'
                     })
    
    elif decision == 'refused':
        application.status = 'refused'
        application.administration_validated_at = datetime.now()
        application.save()

        #Notify student refused by the administration
        Notification(
            recipient_id = application.student_id,
            type='refused',
            application_id=str(application.id),
            message='Sorry, your internship application has been refused by the university administration'
        ).save()

        return Response({'message':'Application refused by the administration'})


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