from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from apps.autos.models import Auto


# Create your views here.
@login_required
def reserva_crear(request, slug):#Obtenemos el auto por slug
    auto = Auto.objects.get(slug=slug)
    #Obtenemos el usuario logueado
    usuario = request.user
    #Validamos que el usuario sea cliente
    if not usuario.groups.filter(name='Cliente').exists():
        return redirect('home')
    #Creamos el formulario
    form = AutoForm()
    #Si el metodo es POST, guardamos el formulario
    if request.method == 'POST':
        form = AutoForm(request.POST)
        if form.is_valid():
            auto = form.save(commit=False)
            auto.usuario = usuario
            auto.save()
            return redirect('home')
    return render(request, 'reservas/reserva_crear.html', {'form': form})
    

@login_required
def mis_reservas(request):
    reservas =   Reserva.objects.filter(usuario=request.user)
    return render(request, 'reservas/mis_reservas.html', {'reservas': reservas})
