from mongoengine import Document, StringField , DateTimeField , BooleanField, ListField
from datetime import datetime

class Offer(Document):
    company_id = StringField(required=True)
    title = StringField(required=True)
    description = StringField(required=True)
    required_skills = ListField(StringField(), default=[])
    wilaya = StringField(required=True)
    type = StringField(required=True, choices=['presentiel', 'remote', 'hybride'])
    duration = StringField(required=True)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.now)
    
    meta = {
        'collection': 'offers'
    }