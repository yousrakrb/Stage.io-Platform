from django.urls import path
from . import views

urlpatterns = [
    path('follow/<str:company_id>/', views.follow_company , name='follow_company'),
    path('unfollow/<str:company_id>/', views.unfollow_company , name='unfollow_company'),
    path('check/<str:company_id>/', views.check_follow , name='check_follow'),
    path('following/', views.get_following_companies , name='get_following_companies'),
]

