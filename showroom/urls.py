from django.urls import path
from . import views

app_name = 'showroom'

urlpatterns = [
    path('', views.showroom_index, name='index'),
    path('model/<slug:initial_slug>/', views.showroom_index, name='model_detail'),
    
    # REST API endpoints
    path('api/cars/', views.api_cars_list, name='api_cars_list'),
    path('api/cars/<slug:slug>/', views.api_car_detail, name='api_car_detail'),
    path('api/search/', views.api_search, name='api_search'),
    path('api/inquiry/', views.api_save_inquiry, name='api_save_inquiry'),
]

