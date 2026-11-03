from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import datetime
from django.utils.text import slugify
#esto solo es para que el programa sepa siempre que año es, no se si sea una buena implementación
# - Ismael !!! 
ahora = datetime.now()
anho_actual = datetime.year
#será necesario ponerles verbose name a todos?
class Auto(models.Model):
    marca = models.CharField(max_length=20)
    modelo = models.CharField(max_length=20)
    patente = models.CharField(max_length=20, unique=True)
    color = models.CharField(max_length=20)
    # el DateField de Django no tiene para sacar el año actual por su cuenta, x eso hice esto - I !!!!
    anho = models.IntegerField(verbose_name="Año de fabricación",validators=[MinValueValidator(1920),      
            MaxValueValidator(anho_actual) 
        ],
        default=anho_actual
    )
    precio_hora = models.FloatField()
    #pal slug panchito, tu q le sabes. Copiaré y adaptaré el código del profe debajo de la class meta
    slug = models.SlugField(max_length=220, unique=True, blank=True)

    class Meta():
        verbose_name_plural = "Automóviles"
        ordering = ['-anho']

    def __str__(self):
        return f"{self.marca}  {self.modelo} ({self.anho})"

    @property 
    def precio_formateado(self):
        return f"${self.precio_hora}CLP por hora de arriendo"

    #esto genera la URL amigable. es el método save por defecto del Django pero le sobreescribe algunas cosas
    # x ejemplo (leer comentarios a lo largo del método) - I !!!! 
    def save(self, *args, **kwargs):
        #acá lo que hace es verificar q el objeto no tenga un slug
        if not self.slug:
            base_slug = slugify(self.nombre)
            slug = base_slug
            #aca define un contador y si existe uno cn el mismo nombre (que no debiera suceder por el unique en el campo de slug)
            #le añade un numero, x ejemplo toyota-corolla y toyota-corolla-1
            contador = 1
            while Auto.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{contador}"
                contador += 1
            self.slug = slug
        super().save(*args, **kwargs)