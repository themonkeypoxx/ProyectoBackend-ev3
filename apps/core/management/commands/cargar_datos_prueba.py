from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.autos.models import Auto, Categoria

CATEGORIAS = [
    {"nombre": "Económico", "descripcion": "Autos pequeños, ideales para la ciudad y bajo consumo."},
    {"nombre": "Sedán", "descripcion": "Cuatro puertas y maletero amplio, cómodos para viajes."},
    {"nombre": "SUV", "descripcion": "Utilitarios con mayor altura y espacio para la familia."},
    {"nombre": "Camioneta", "descripcion": "Pick-ups de carga y tracción para trabajo y aventura."},
]

# (categoría, marca, modelo, patente, color, año, precio por día en CLP)
AUTOS = [
    ("Económico", "Hyundai", "Accent", "HZKP-41", "Blanco", 2021, 14500),
    ("Económico", "Kia", "Rio", "LRTW-58", "Gris", 2020, 13500),
    ("Sedán", "Toyota", "Corolla", "FBNC-73", "Negro", 2022, 25000),
    ("Sedán", "Nissan", "Sentra", "KWPD-29", "Plateado", 2021, 22000),
    ("SUV", "Chevrolet", "Tracker", "RTGH-16", "Rojo", 2023, 32000),
    ("SUV", "Mazda", "CX-5", "MXVL-84", "Azul", 2022, 38000),
    ("Camioneta", "Toyota", "Hilux", "SDFJ-35", "Blanco", 2023, 45000),
    ("Camioneta", "Ford", "Ranger", "NQWB-62", "Gris", 2022, 47000),
]

USUARIOS = [
    {"username": "admin", "email": "admin@moongo.cl", "staff": True},
    {"username": "cliente", "email": "cliente@moongo.cl", "staff": False},
]


class Command(BaseCommand):
    help = "Carga datos de prueba: categorías, autos y usuarios (admin y cliente). Es idempotente."

    def add_arguments(self, parser):
        parser.add_argument(
            "--migrar",
            action="store_true",
            help="Ejecuta 'migrate' antes de cargar los datos.",
        )
        parser.add_argument(
            "--password",
            default="Moongo2026!",
            help="Contraseña para los usuarios de prueba (por defecto: Moongo2026!).",
        )

    def handle(self, *args, **options):
        if options["migrar"]:
            self.stdout.write("Aplicando migraciones...")
            call_command("migrate", interactive=False, verbosity=0)
            self.stdout.write(self.style.SUCCESS("Migraciones aplicadas."))

        with transaction.atomic():
            self._cargar_categorias()
            self._cargar_autos()
            self._cargar_usuarios(options["password"])

        self.stdout.write(self.style.SUCCESS("Datos de prueba cargados correctamente."))
        self.stdout.write(f"  Categorías: {Categoria.objects.count()}")
        self.stdout.write(f"  Autos: {Auto.objects.count()}")
        self.stdout.write(f"  Usuarios de prueba: admin / {options['password']} y cliente / {options['password']}")

    def _cargar_categorias(self):
        for datos in CATEGORIAS:
            Categoria.objects.update_or_create(
                nombre=datos["nombre"],
                defaults={"descripcion": datos["descripcion"]},
            )
        self.stdout.write(f"Categorías listas: {len(CATEGORIAS)}")

    def _cargar_autos(self):
        for cat, marca, modelo, patente, color, anho, precio in AUTOS:
            Auto.objects.update_or_create(
                patente=patente,
                defaults={
                    "categoria": Categoria.objects.get(nombre=cat),
                    "marca": marca,
                    "modelo": modelo,
                    "color": color,
                    "anho": anho,
                    "precio_dia": precio,
                },
            )
        self.stdout.write(f"Autos listos: {len(AUTOS)}")

    def _cargar_usuarios(self, password):
        User = get_user_model()
        for datos in USUARIOS:
            user, _ = User.objects.get_or_create(
                username=datos["username"],
                defaults={"email": datos["email"]},
            )
            user.email = datos["email"]
            user.is_active = True
            user.is_staff = datos["staff"]
            user.is_superuser = datos["staff"]
            user.set_password(password)
            user.save()
        self.stdout.write(f"Usuarios listos: {len(USUARIOS)}")
