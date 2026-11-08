from django.urls import path
from . import views

app_name = 'reservas'

urlpatterns = [
    path('reservas/mis-reservas/', views.mis_reservas, name='mis_reservas'),
    path('reservas/nueva/<slug:slug>/', views.reserva_crear, name='crear'),
]