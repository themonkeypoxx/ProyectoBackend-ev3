from django import forms
from .models import Auto


class AutoForm(forms.ModelForm):
    class Meta:
        model = Auto
        fields = ['categoria', 'marca', 'modelo', 'patente', 'color', 'anho', 'precio_dia', 'imagen']
        labels = {
            'anho': 'Año de fabricación',
            'precio_dia': 'Precio por día (CLP)',
            'imagen': 'Fotografía del vehículo',
        }
