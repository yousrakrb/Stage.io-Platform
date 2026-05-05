from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_offers, name='get_offers'),
    path('create/', views.create_offer, name='create_offer'),
    path('my-offers/', views.get_my_offers, name='get_my_offers'),
    path('<str:offer_id>/update/', views.update_offer, name='update_offer'),
    path('<str:offer_id>/delete/', views.delete_offer, name='delete_offer'),
]