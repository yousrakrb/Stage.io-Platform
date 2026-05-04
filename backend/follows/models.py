from mongoengine import Document , StringField , DateTimeField
from datetime import datetime

class Follow(Document):
    student_id = StringField(required=True)
    company_id = StringField(required=True)
    created_at = DateTimeField(default=datetime.now)

    meta = {
        'collection': 'follows'}