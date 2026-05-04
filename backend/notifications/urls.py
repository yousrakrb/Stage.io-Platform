from django.urls import path 
from . import views

urlpatterns = [
     path('', views.get_notifications, name='get_notifications'),
     path('unread/', views.get_unread_count, name='get_unread_count'),
     path('<str:notification_id>/read/', views.mark_as_read, name= 'mark_as_read'),
]