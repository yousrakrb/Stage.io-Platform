from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.get_conversations, name='get_conversations'),
    path('send/<str:application_id>/', views.send_message, name='send_message'),
    path('<str:application_id>/', views.get_messages, name='get_messages'),
    path('<str:message_id>/read/', views.mark_as_read, name='mark_as_read'),
]