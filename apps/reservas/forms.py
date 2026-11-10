from django import forms
from .models import Reserva


class ReservaForm(forms.ModelForm):
    fecha_inicio = forms.DateTimeField(
        label='Desde',
        input_formats=['%Y-%m-%dT%H:%M'],
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
    )
    fecha_fin = forms.DateTimeField(
        label='Hasta',
        input_formats=['%Y-%m-%dT%H:%M'],
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
    )

    class Meta:
        model = Reserva
        fields = ['fecha_inicio', 'fecha_fin']

    def __init__(self, *args, auto=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.auto = auto

    def clean(self):
        cleaned = super().clean()
        inicio = cleaned.get('fecha_inicio')
        fin = cleaned.get('fecha_fin')

        if inicio and fin:
            if fin <= inicio:
                raise forms.ValidationError(
                    "La fecha de término debe ser posterior a la de inicio."
                )
            if self.auto:
                solapadas = Reserva.objects.filter(
                    auto=self.auto,
                    estado__in=['pendiente', 'confirmada'],
                    fecha_inicio__lt=fin,
                    fecha_fin__gt=inicio,
                )
                if solapadas.exists():
                    raise forms.ValidationError(
                        "El auto ya está reservado en ese rango de fechas."
                    )
        return cleaned