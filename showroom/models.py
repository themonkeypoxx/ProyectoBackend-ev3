from django.db import models


class CarModel(models.Model):
    SERIES_CHOICES = [
        ('911', '911'),
        ('718', '718'),
        ('taycan', 'Taycan'),
        ('hypercar', 'Hypercar'),
    ]

    slug = models.SlugField(max_length=60, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=150)
    tagline = models.TextField()
    series = models.CharField(max_length=50, default='Sport')
    base_price = models.PositiveIntegerField(help_text="Base price in USD or EUR")
    hero_image = models.CharField(max_length=255, default='/static/cars/porsche-911-studio.jpg')
    model_3d = models.CharField(max_length=255, blank=True, default='/static/models/honda_civic_hatchback/scene.gltf', help_text="Ruta al modelo 3D GLTF/GLB")
    description = models.TextField()
    badge_text = models.CharField(max_length=50, blank=True, default='GT MOTORSPORT')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'base_price']
        verbose_name = "Modelo de Vehículo"
        verbose_name_plural = "Modelos de Vehículos"

    def __str__(self):
        return f"{self.name} ({self.full_name})"

    def to_dict(self):
        specs_dict = {}
        if hasattr(self, 'specs'):
            specs_dict = {
                'acceleration': self.specs.acceleration,
                'topSpeed': self.specs.top_speed,
                'powerHp': self.specs.power_hp,
                'powerKw': self.specs.power_kw,
                'engine': self.specs.engine,
                'torque': self.specs.torque,
                'drivetrain': self.specs.drivetrain,
                'weight': self.specs.weight,
                'transmission': self.specs.transmission,
            }

        return {
            'id': self.slug,
            'name': self.name,
            'fullName': self.full_name,
            'tagline': self.tagline,
            'series': self.series,
            'basePrice': self.base_price,
            'heroImage': self.hero_image,
            'model3d': self.model_3d or '/static/models/honda_civic_hatchback/scene.gltf',
            'description': self.description,
            'badgeText': self.badge_text,
            'specs': specs_dict,
            'colors': [
                {
                    'id': c.color_id,
                    'name': c.name,
                    'hex': c.hex_code,
                    'code': c.code,
                    'image': c.image,
                    'type': c.color_type,
                    'price': c.price,
                }
                for c in self.colors.all()
            ],
            'wheels': [
                {
                    'id': w.wheel_id,
                    'name': w.name,
                    'size': w.size,
                    'finish': w.finish,
                    'price': w.price,
                }
                for w in self.wheels.all()
            ],
            'hotspots': [
                {
                    'id': h.hotspot_id,
                    'title': h.title,
                    'category': h.category,
                    'description': h.description,
                    'spec': h.spec,
                    'x': h.x,
                    'y': h.y,
                }
                for h in self.hotspots.all()
            ]
        }


class CarSpec(models.Model):
    car = models.OneToOneField(CarModel, on_delete=models.CASCADE, related_name='specs')
    acceleration = models.CharField(max_length=30, default='3.2s')
    top_speed = models.CharField(max_length=30, default='296 km/h')
    power_hp = models.CharField(max_length=30, default='525 HP')
    power_kw = models.CharField(max_length=30, default='386 kW')
    engine = models.CharField(max_length=150, default='4.0L Naturally Aspirated Boxer-6')
    torque = models.CharField(max_length=50, default='465 Nm')
    drivetrain = models.CharField(max_length=150, default='Rear-Wheel Drive')
    weight = models.CharField(max_length=50, default='1,450 kg')
    transmission = models.CharField(max_length=150, default='7-Speed Porsche Doppelkupplung (PDK)')

    class Meta:
        verbose_name = "Ficha Técnica"
        verbose_name_plural = "Fichas Técnicas"

    def __str__(self):
        return f"Specs de {self.car.name}"


class PaintColor(models.Model):
    COLOR_TYPE_CHOICES = [
        ('standard', 'Estándar'),
        ('metallic', 'Metalizado'),
        ('special', 'Especial / Crayon'),
    ]

    car = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name='colors')
    color_id = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    hex_code = models.CharField(max_length=20)
    code = models.CharField(max_length=20)
    image = models.CharField(max_length=255)
    color_type = models.CharField(max_length=20, choices=COLOR_TYPE_CHOICES, default='standard')
    price = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'price']
        verbose_name = "Color de Pintura"
        verbose_name_plural = "Colores de Pintura"

    def __str__(self):
        return f"{self.car.name} - {self.name} ({self.code})"


class WheelOption(models.Model):
    car = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name='wheels')
    wheel_id = models.CharField(max_length=50)
    name = models.CharField(max_length=150)
    size = models.CharField(max_length=50)
    finish = models.CharField(max_length=100)
    price = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'price']
        verbose_name = "Opción de Rueda / Llanta"
        verbose_name_plural = "Opciones de Ruedas / Llantas"

    def __str__(self):
        return f"{self.car.name} - {self.name}"


class CarHotspot(models.Model):
    car = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name='hotspots')
    hotspot_id = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    description = models.TextField()
    spec = models.CharField(max_length=100)
    x = models.FloatField(help_text="X position percentage (0-100)")
    y = models.FloatField(help_text="Y position percentage (0-100)")

    class Meta:
        verbose_name = "Punto de Interés (Hotspot)"
        verbose_name_plural = "Puntos de Interés (Hotspots)"

    def __str__(self):
        return f"{self.car.name} - {self.title}"


class PackageOption(models.Model):
    package_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=120)
    description = models.TextField()
    price = models.PositiveIntegerField(default=0)
    is_default = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Paquete de Equipamiento"
        verbose_name_plural = "Paquetes de Equipamiento"

    def __str__(self):
        return f"{self.name} (+${self.price:,})"


class CarInquiry(models.Model):
    car = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name='inquiries')
    color = models.ForeignKey(PaintColor, on_delete=models.SET_NULL, null=True, blank=True)
    wheel = models.ForeignKey(WheelOption, on_delete=models.SET_NULL, null=True, blank=True)
    selected_packages = models.JSONField(default=list, blank=True)
    total_price = models.PositiveIntegerField()
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=50, blank=True)
    dealer_location = models.CharField(max_length=100, default='Porsche Centre Stuttgart')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Reserva / Solicitud"
        verbose_name_plural = "Reservas y Solicitudes"

    def __str__(self):
        return f"Solicitud de {self.customer_name} para {self.car.name} (${self.total_price:,})"
