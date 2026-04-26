from mongoengine import Document , StringField , DateTimeField
from datetime import datetime

class Application(Document):
    student_id = StringField(required=True)
    offer_id = StringField(required=True)
    company_id = StringField(required=True)
    status = StringField(default='pending' , choices=['pending', 'accepted', 'refused','validated'])
    applied_at = DateTimeField(default=datetime.now)
    company_decision_at = DateTimeField(null=True)
    administration_validated_at = DateTimeField(null=True)
    convention_url = StringField(default='')

    meta = {
        'collection': 'applications',   }