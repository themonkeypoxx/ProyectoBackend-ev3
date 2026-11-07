from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('autos/', include('apps.autos.urls')),
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('registrar/', include('apps.usuarios.urls')),
    path('', lambda request: redirect('autos:lista')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)