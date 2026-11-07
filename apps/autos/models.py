from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.utils.text import slugify


def anho_actual():
    return timezone.now().year


class Auto(models.Model):
    marca = models.CharField(max_length=20)
    modelo = models.CharField(max_length=20)
    patente = models.CharField(max_length=20, unique=True)
    color = models.CharField(max_length=20)
    anho = models.IntegerField(
        verbose_name="Año de fabricación",
        validators=[MinValueValidator(1920), MaxValueValidator(anho_actual)],
        default=anho_actual,
    )
    precio_dia = models.IntegerField(verbose_name= "Precio por día", validators=[MinValueValidator(13000)], default=13000)
    slug = models.SlugField(max_length=80, unique=True, blank=True, editable=False)
    imagen = models.ImageField( verbose_name="Imagen",upload_to="autos/", blank=True, null=True,)

    class Meta():
        verbose_name_plural = "Automóviles"
        ordering = ['-anho']

    def __str__(self):
        return f"{self.marca}  {self.modelo} ({self.anho})"

    @property
    def precio_formateado(self):
        return f"${self.precio_dia:,.0f} CLP por dia de arriendo"

    #esto genera la URL amigable. es el método save por defecto del Django pero le sobreescribe algunas cosas
    # x ejemplo (leer comentarios a lo largo del método) - Ismael !!!!
    def save(self, *args, **kwargs):
        #acá lo que hace es verificar q el objeto no tenga un slug ya creado
        if not self.slug:
            # antes decía self.nombre, que no existe; ahora se usa marca + modelo
            base_slug = slugify(f"{self.marca} {self.modelo}")
            slug = base_slug
            #aca define un contador y si existe uno cn el mismo nombre (que no debiera suceder por el unique en el campo de slug)
            #le añade un numero, x ejemplo toyota-corolla y toyota-corolla-1
            contador = 1
            while Auto.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{contador}"
                contador += 1
            self.slug = slug
        super().save(*args, **kwargs)