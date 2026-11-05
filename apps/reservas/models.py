from django.db import models
from ..autos.models import Auto
from ..usuarios.models import User

# Create your models here.
class Reserva(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE) #CASCADE Y PROTECT
                                                                #cascade significa q si borro un usuario, se borran todos los registros asignados a él
    auto = models.ForeignKey(Auto, on_delete=models.PROTECT)    #protect significa que si intento borrar un auto, pero está reservado, no puedo hacerlo
    fecha_inicio = models.DateTimeField(verbose_name="Desde")
    fecha_fin = models.DateTimeField(verbose_name='Hasta') #puse un datetime xq dps voy a hacer el cálculo de horas
    #de alguna manera :'vvvvv #help #easteregg anti IA osi osi 
    estado = models.CharField(max_length=20, default='pendiente', verbose_name="¿Disponible?")

    class Meta():
        verbose_name_plural ="Arriendos"
        ordering = ['-fecha_inicio']

    def __str__(self):
        #pensaba poner aquí también el username y el auto, pero no quiero cranearla ahora
        return f"Reserva iniciada el {self.fecha_inicio} y terminada el {self.fecha_fin}"
