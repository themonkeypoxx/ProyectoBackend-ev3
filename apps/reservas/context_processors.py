from .models import Reserva


#para mostrar reservas activas en cada template 
def reservas_context(request):
    if not request.user.is_authenticated:
        return {}
    activas = Reserva.objects.filter(
        usuario=request.user,
        estado__in=['pendiente', 'confirmada'],
    ).count()
    return {'reservas_activas': activas}