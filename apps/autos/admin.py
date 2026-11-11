from django.contrib import admin
from django.utils.html import format_html
from .models import Auto, Categoria
from django.utils.safestring import mark_safe

admin.site.site_header = "Arriendo de Autos - Panel de Administración"
admin.site.site_title = "Arriendo de Autos Admin"
admin.site.index_title = "Gestión de la Flota y Tarifas"


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)


@admin.register(Auto)
class AutoAdmin(admin.ModelAdmin):
    list_display = ('foto_miniatura', 'marca', 'modelo', 'categoria', 'patente', 'anho', 'color', 'precio_dia', 'slug')
    list_filter = ('categoria', 'marca', 'anho', 'color')
    search_fields = ('marca', 'modelo', 'patente', 'color')
    list_editable = ('precio_dia',)
    readonly_fields = ('slug', 'vista_previa')
    list_per_page = 15

    def foto_miniatura(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;" />', obj.imagen.url)
        return mark_safe('<span style="color: #999;">Sin foto</span>')
    foto_miniatura.short_description = "Foto"

    def vista_previa(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" style="max-width: 250px; max-height: 180px; object-fit: contain; border-radius: 6px;" />', obj.imagen.url)
        return "No hay imagen subida"
    vista_previa.short_description = "Vista previa"
