from django.contrib.auth.decorators import login_required


from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegistroForm
from django.contrib import messages

def registro(request):
    if request.method == 'POST':
        form = RegistroForm(request.POST)
        if form.is_valid():
            user = form.save() 
            login(request, user) 
            
            messages.success(request, "¡Registro exitoso! Bienvenido.")
            return redirect('/autos/') 
        else:
            # considerar sacar este print dps
            print(form.errors)
    else:
        form = RegistroForm()
     
    return render(request, 'registration/regis.html', {'form': form})

@login_required
def rediccion_por_rol(request):
    # se evalua el rol del user
    if request.user.is_superuser or request.user.is_staff:
        return redirect('/admin/')  # Redirige al panel de administración nativo
    else:
        return redirect('/autos/')  # Redirige al inicio o perfil de usuario normal


