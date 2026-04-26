from django.urls import path
from . import views

urlpatterns = [
    path('apply/<str:offer_id>/' , views.apply, name='apply'),
    path('my/', views.get_my_applications, name='get_my_applications'),
    path('company/', views.get_company_applications , name='get_company_applications'),
    path('decision/<str:application_id>/', views.company_decision, name='company_decision'),
    path('validate/<str:application_id>/', views.validate_application, name="validate_application"),
    path('pending/', views.get_pending_validations, name='get_pending_validations'),
    path('statistics/', views.get_statistics, name='get_statistics'),
    path('download/<str:application_id>/', views.download_convention, name='download_convention'),
]
