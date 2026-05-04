from mongoengine import Document, StringField,  DateTimeField , BooleanField , ListField
from datetime import datetime

class User(Document):
    full_name = StringField(required=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(required=True, choices=['student', 'company' , 'administration'])
    phone = StringField(default='')
    student_type = StringField(default='', choices=['university', 'independent',''])
    student_card_id = StringField(default='')
    director_full_name = StringField(default='')
    director_email = StringField(default='')
    director_phone = StringField(default='')
    is_verified = BooleanField(default=False)
    verification_code = StringField(default='')
    created_at = DateTimeField(default=datetime.now)
#cv as form for all 
    meta = { 'collection': 'users' }

# will make changes here we add the cv section and we akso dekete what we added in the cv we just keep a simple inforations in the profile 
class StudentProfile(Document):
        user_id = StringField(required=True)
        wilaya = StringField(default="")
        bio = StringField(default="")
        avatar_url = StringField(default="")
        placed = BooleanField(default=False)
        cv_url = StringField(default="")
        university = StringField(default="")
        major = StringField(default="" , choices=['IT', 'Health', 'Law', 'Commerce','Art', 'Other', ''])
        speciality = StringField(default="")
        graduation_year = StringField(default="")
        github_link = StringField(default="")
        portfolio_link = StringField(default="")
        skills = ListField(default=[])
        languages = ListField(default=[])
        experiences = ListField(default=[])
        certifications = ListField(default=[])

        meta = {'collection': 'student_profiles' , 'strict': False}
        
class CompanyProfile(Document):
        user_id = StringField(required=True)
        company_name = StringField(default="")
        description = StringField(default="")
        logo_url = StringField(default="")
        wilaya = StringField(default="")
        address = StringField(default="")
        website = StringField(default="")
        industry = StringField(default="")
        phone = StringField(default="")
        director_full_name = StringField(default="")
        director_email = StringField(default="")
        director_phone = StringField(default="")

        meta = {'collection': 'company_profiles'}    

class AdministrationProfile(Document):
        user_id = StringField(required=True)
        university = StringField(default="")
        wilaya = StringField(default="")
        location = StringField(default="")
        logo_url = StringField(default="")
        director_full_name = StringField(default="")
        director_email = StringField(default="")
        director_phone = StringField(default="")

        meta = {'collection': 'administration_profiles'}    