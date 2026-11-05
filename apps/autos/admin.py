from django.contrib import admin
from .models import Auto

admin.site.site_header = "Arriendo de Autos - Panel de Administración"
admin.site.site_title = "Arriendo de Autos Admin"
admin.site.index_title = "Gestión de la Flota y Tarifas"


@admin.register(Auto)
class AutoAdmin(admin.ModelAdmin):
    list_display = ('marca', 'modelo', 'patente', 'anho', 'color', 'precio_hora', 'slug')
    list_filter = ('marca', 'anho', 'color')
    search_fields = ('marca', 'modelo', 'patente', 'color')
    list_editable = ('precio_hora',)
    readonly_fields = ('slug',)
    list_per_page = 15