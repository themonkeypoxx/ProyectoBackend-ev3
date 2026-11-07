from django.urls import path
from . import views

urlpatterns = [
    path('', views.registro, name='registro'),
    path('redireccion/', views.rediccion_por_rol, name='redireccion_por_rol'),
]

