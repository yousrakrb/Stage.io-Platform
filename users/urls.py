from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('verify-email/', views.verify_email, name='verify_email'),
    path('login/', views.login, name='login'),
    path('student/profile/', views.student_profile, name='student_profile'),
    path('company/profile/', views.company_profile, name='company_profile'),
    path('administration/profile/', views.administration_profile, name='administration_profile'),
    path('upload/avatar/', views.upload_avatar, name='upload_avatar'),
    path('upload/logo/', views.upload_logo, name='upload_logo'),
    path('public/company/<str:company_id>/', views.public_company_profile, name='public_company_profile'),
    path('public/student/<str:student_id>/', views.public_student_profile, name='public_student_profile'),
    path('public/administration/<str:administration_id>/', views.public_administration_profile, name='public_administration_profile'),
    path('cv/save/', views.save_cv, name='save_cv'),
    path('cv/', views.get_cv, name='get_cv'),
    path('cv/download/', views.download_cv, name='download_cv'),
    path('cv/<str:student_id>/download/', views.download_student_cv, name='download_student_cv'),
]
