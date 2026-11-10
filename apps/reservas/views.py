from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404

from apps.autos.models import Auto
from .forms import ReservaForm
from .models import Reserva


@login_required
def reserva_crear(request, slug):
    auto = get_object_or_404(Auto, slug=slug)

    if not request.user.groups.filter(name='Cliente').exists():
        messages.error(request, "Solo los clientes pueden hacer reservas.")
        return redirect('autos:lista')

    if request.method == 'POST':
        form = ReservaForm(request.POST, auto=auto)
        if form.is_valid():
            reserva = form.save(commit=False)
            reserva.usuario = request.user
            reserva.auto = auto
            reserva.estado = 'pendiente'
            reserva.save()
            messages.success(request, "Reserva creada correctamente.")
            return redirect('reservas:mis_reservas')
    else:
        form = ReservaForm(auto=auto)

    return render(request, 'reservas/reserva_form.html', {'form': form, 'auto': auto})


@login_required
def mis_reservas(request):
    reservas = Reserva.objects.filter(usuario=request.user)
    return render(request, 'reservas/mis_reservas.html', {'reservas': reservas})