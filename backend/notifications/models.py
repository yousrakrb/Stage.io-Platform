from mongoengine import Document, StringField, DateTimeField, BooleanField 
from datetime import datetime


class Notification(Document):
    recipient_id = StringField(required=True)
    type = StringField(required=True , choices=[
        'new_application',
        'pending_validation',
        'validated',
        'refused',
        'new_offer'
    ])
    application_id = StringField(required=True)
    message = StringField(required=True)
    is_read = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.now)

    meta = { 'collection': 'notifications' }