from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Auto
from .forms import AutoForm


def es_administrador(user):
    return user.is_authenticated and (user.is_staff or user.is_superuser)


def auto_lista(request):
    query = request.GET.get('q', '').strip()
    marca = request.GET.get('marca', '')
    orden = request.GET.get('orden', '-anho')

    autos = Auto.objects.all()

    if marca:
        autos = autos.filter(marca=marca)

    if query:
        autos = autos.filter(
            Q(marca__icontains=query) |
            Q(modelo__icontains=query) |
            Q(color__icontains=query)
        )

    ordenes_validos = {
        'precio_asc': 'precio_hora',
        'precio_desc': '-precio_hora',
        'modelo_asc': 'modelo',
        'anho_desc': '-anho',
    }
    autos = autos.order_by(ordenes_validos.get(orden, '-anho'))

    paginador = Paginator(autos, 6)
    pagina = paginador.get_page(request.GET.get('page'))
    marcas = Auto.objects.values_list('marca', flat=True).distinct().order_by('marca')

    return render(request, 'autos/auto_lista.html', {
        'autos': pagina,
        'marcas': marcas,
        'marca_seleccionada': marca,
        'query_actual': query,
        'orden_actual': orden,
        'total_resultados': autos.count(),
    })


def auto_detalle(request, slug):
    auto = get_object_or_404(Auto, slug=slug)
    similares = Auto.objects.filter(marca=auto.marca).exclude(pk=auto.pk)[:3]
    return render(request, 'autos/auto_detalle.html', {'auto': auto, 'similares': similares})


@login_required
@user_passes_test(es_administrador, login_url='autos:lista')
def gestion_autos(request):
    query = request.GET.get('q', '').strip()
    autos = Auto.objects.all()
    if query:
        autos = autos.filter(Q(marca__icontains=query) | Q(modelo__icontains=query) | Q(patente__icontains=query))
    paginador = Paginator(autos.order_by('-anho'), 10)
    pagina = paginador.get_page(request.GET.get('page'))
    return render(request, 'autos/gestion_autos.html', {'autos': pagina, 'query': query})


@login_required
@user_passes_test(es_administrador, login_url='autos:lista')
def auto_crear(request):
    if request.method == 'POST':
        form = AutoForm(request.POST)
        if form.is_valid():
            auto = form.save()
            messages.success(request, f"¡Auto '{auto}' creado exitosamente!")
            return redirect('autos:gestion')
    else:
        form = AutoForm()
    return render(request, 'autos/auto_form.html', {
        'form': form,
        'titulo_accion': 'Ingresar Nuevo Auto',
        'boton_texto': 'Guardar',
    })


@login_required
@user_passes_test(es_administrador, login_url='autos:lista')
def auto_editar(request, id):
    auto = get_object_or_404(Auto, id=id)
    if request.method == 'POST':
        form = AutoForm(request.POST, instance=auto)
        if form.is_valid():
            form.save()
            messages.success(request, f"Auto '{auto}' actualizado.")
            return redirect('autos:gestion')
    else:
        form = AutoForm(instance=auto)
    return render(request, 'autos/auto_form.html', {
        'form': form,
        'auto': auto,
        'titulo_accion': 'Editar Auto',
        'boton_texto': 'Actualizar',
    })


@login_required
@user_passes_test(es_administrador, login_url='autos:lista')
def auto_eliminar(request, id):
    auto = get_object_or_404(Auto, id=id)
    if request.method == 'POST':
        nombre = str(auto)
        auto.delete()
        messages.success(request, f"Auto '{nombre}' eliminado.")
        return redirect('autos:gestion')
    return render(request, 'autos/auto_confirmar_eliminar.html', {'auto': auto})