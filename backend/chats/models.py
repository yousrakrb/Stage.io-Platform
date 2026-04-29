from mongoengine import Document, StringField, BooleanField,  DateTimeField
from datetime import datetime

class Message(Document):
    sender_id = StringField(required=True)
    receiver_id = StringField(required=True)
    application_id = StringField(required=True)
    content = StringField(required=True)
    is_read = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.now)

    meta = { 'collection': 'messages' }
