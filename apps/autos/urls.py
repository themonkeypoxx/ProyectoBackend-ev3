from django.urls import path
from . import views

app_name = 'autos'

urlpatterns = [
    path('', views.auto_lista, name='lista'),
    path('auto/<slug:slug>/', views.auto_detalle, name='detalle'),
    path('gestion/', views.gestion_autos, name='gestion'),
    path('gestion/nuevo/', views.auto_crear, name='crear'),
    path('gestion/<int:id>/editar/', views.auto_editar, name='editar'),
    path('gestion/<int:id>/eliminar/', views.auto_eliminar, name='eliminar'),
]