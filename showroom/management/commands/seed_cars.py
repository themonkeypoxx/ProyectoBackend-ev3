from django.core.management.base import BaseCommand
from showroom.models import CarModel, CarSpec, PaintColor, WheelOption, CarHotspot, PackageOption


class Command(BaseCommand):
    help = 'Carga la base de datos con los vehículos y vincula el modelo 3D GLTF'

    def handle(self, *args, **options):
        self.stdout.write("Actualizando base de datos con el modelo 3D GLTF de Honda Civic Hatchback...")

        # 1. Paquetes de Equipamiento
        packages_data = [
            {
                'package_id': 'pkg-hpd',
                'name': 'Paquete Deportivo HPD (Honda Performance Development)',
                'description': 'Alerón trasero deportivo, faldones laterales, difusor inferior y emblemas en negro brillante.',
                'price': 2850,
                'is_default': True,
                'order': 1,
            },
            {
                'package_id': 'pkg-bose',
                'name': 'Sistema de Sonido Premium Bose® con 12 Altavoces',
                'description': 'Procesamiento de señal digital Centerpoint® y tecnología envolvente SurroundStage®.',
                'price': 1450,
                'is_default': True,
                'order': 2,
            },
            {
                'package_id': 'pkg-sensing',
                'name': 'Honda Sensing® Elite Suite',
                'description': 'Control de crucero adaptativo, frenado con mitigación de colisión y asistente de mantenimiento de carril.',
                'price': 1890,
                'is_default': True,
                'order': 3,
            },
        ]

        for pkg in packages_data:
            PackageOption.objects.update_or_create(
                package_id=pkg['package_id'],
                defaults=pkg
            )

        cars_data = [
                        {
                            'slug': 'honda-civic-hatchback',
                            'name': 'CIVIC HATCHBACK',
                            'full_name': 'Honda Civic Hatchback Sport Touring',
                            'tagline': 'Diseño aerodinámico fastback, dinamismo deportivo y tecnología de vanguardia.',
                            'series': 'Civic',
                            'base_price': 25000,
                            'hero_image': '/static/cars/Honda_civic.png',
                            'model_3d': '/static/models/honda_civic_hatchback/scene.glb',
                            'description': 'El Honda Civic Hatchback combina una silueta deportiva inspirada en los coupés con la versatilidad de cinco puertas. Su chasis de alta rigidez, suspensión independiente y motor VTEC Turbo garantizan una experiencia de conducción reactiva e intuitiva.',
                            'badge_text': '1',
                            'order': 1,
                            'specs': {
                                'acceleration': '6,8 s',
                                'top_speed': '225 km/h',
                                'power_hp': '182 CV',
                                'power_kw': '134 kW',
                                'engine': '1.5L VTEC Turbo Inyección Directa 16 Válvulas',
                                'torque': '240 Nm',
                                'drivetrain': 'Tracción Delantera con Vectorización de Par (AHA)',
                                'weight': '1.390 kg',
                                'transmission': 'Manual de 6 velocidades con Rev-Matching / CVT',
                            }
                        },
                        {
                            'slug': 'kia-sportage',
                            'name': 'KIA SPORTAGE',
                            'full_name': 'KIA SPORTAGE EX 1.6T, 8AT',
                            'tagline': 'SUV compacto con diseño moderno y tecnología de conducción.',  # Ajusta al texto oficial
                            'series': 'Sportage',
                            'base_price': 32000,
                            'hero_image': '/static/cars/kia_sportage.png',
                            'model_3d': '/static/models/kia_sportage/scene.glb',
                            'description': 'DESCRIPCIÓN OFICIAL DEL SPORTAGE',  # Completar
                            'badge_text': '2',
                            'order': 2,
                            'specs': {
                                'acceleration': '—',          # Completar con datos oficiales
                                'top_speed': '—',
                                'power_hp': '—',
                                'power_kw': '—',
                                'engine': '—',
                                'torque': '—',
                                'drivetrain': '—',
                                'weight': '—',
                                'transmission': '—',
                            }
                        },        ]

        for item in cars_data:
                    car_fields = {
                        'name': item['name'],
                        'full_name': item['full_name'],
                        'tagline': item['tagline'],
                        'series': item['series'],
                        'base_price': item['base_price'],
                        'hero_image': item['hero_image'],
                        'model_3d': item.get('model_3d', '/static/models/kia_sportage/scene.glb'),
                        'description': item['description'],
                        'badge_text': item['badge_text'],
                        'order': item['order'],      
                    }      
        


            
        car, _ = CarModel.objects.update_or_create(slug=item['slug'], defaults=car_fields)

            # Ficha técnica
        CarSpec.objects.update_or_create(car=car, defaults=item['specs'])

        # Colores
        for c_data in item.get('colors', []):
            PaintColor.objects.update_or_create(
                car=car,
                color_id=c_data['color_id'],
                defaults=c_data
            )

        # Llantas
        for w_data in item.get('wheels', []):
            WheelOption.objects.update_or_create(
                car=car,
                wheel_id=w_data['wheel_id'],
                defaults=w_data
            )

        # Puntos clave
        for h_data in item.get('hotspots', []):
            CarHotspot.objects.update_or_create(
                car=car,
                hotspot_id=h_data['hotspot_id'],
                defaults=h_data
            )

        self.stdout.write(self.style.SUCCESS(f"Modelo 3D cargado: {car.name} ({car.model_3d})"))

        # Purga: eliminar cualquier vehículo cuyo slug NO esté en cars_data
        current_slugs = [item['slug'] for item in cars_data]
        deleted_count, _ = CarModel.objects.exclude(slug__in=current_slugs).delete()
        if deleted_count:
            self.stdout.write(self.style.WARNING(
            f"Eliminados {deleted_count} vehiculo(s) obsoleto(s) de la base de datos."
        ))

        self.stdout.write(self.style.SUCCESS(
        f"Base de datos sincronizada. Vehiculos activos: {CarModel.objects.count()}"
        ))
