from django import forms
from .models import Reserva


class AutoForm(forms.ModelForm):
    class Meta:
        model = Auto
        fields = '__all__'
        #estos se asignan en la vista, el cliente no lo hace de manera manual
        exclude = ['estado', 'usuario']
        labels = {
            'anho': 'Año de fabricación',
            'precio_dia': 'Precio por día (CLP)',
            'imagen': 'Fotografía del vehículo',
        }


