# Porsche Showroom & Exclusive Configurator (Django)

Proyecto completamente transformado y migrado a **Django 6.0**. Este sistema integra un backend robusto basado en el ORM de Django con un frontend de lujo que replica la experiencia interactiva 3D del showroom de Porsche, incluyendo telemetría, configurador en tiempo real, efectos sonoros sintetizados mediante Web Audio API y gestión de solicitudes/leads.

---

## 🚀 Cómo Ejecutar el Proyecto

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Aplicar migraciones y cargar datos de vehículos (si es necesario):**
   ```bash
   python manage.py migrate
   python manage.py seed_cars
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   python manage.py runserver
   ```
   Abre tu navegador en `http://127.0.0.1:8000/`.

4. **Acceder al Panel de Administración Django:**
   - URL: `http://127.0.0.1:8000/admin/`
   - **Usuario:** `admin`
   - **Contraseña:** `admin`

---

## 🏛️ Arquitectura del Proyecto

```
moongo/
│
├── moongo_core/                # Configuración principal de Django
│   ├── settings.py             # Configuración general (Apps, Static, DB, Templates)
│   ├── urls.py                 # Enrutamiento raíz y archivos estáticos
│   ├── wsgi.py
│   └── asgi.py
│
├── showroom/                   # Aplicación principal del Showroom
│   ├── models.py               # CarModel, CarSpec, PaintColor, WheelOption, CarHotspot, PackageOption, CarInquiry
│   ├── views.py                # Vistas SSR y endpoints API REST
│   ├── urls.py                 # Rutas de navegación y API
│   ├── admin.py                # Configuración con Inlines para gestión completa
│   ├── tests.py                # Suite de pruebas automatizadas
│   └── management/commands/
│       └── seed_cars.py        # Comando para sembrar la base de datos con los 5 modelos de Porsche
│
├── templates/                  # Plantillas Django
│   ├── base.html               # Plantilla base con Tailwind CSS y fuentes
│   └── showroom/
│       ├── index.html          # Vista principal del showroom
│       └── partials/
│           ├── header.html               # Barra de navegación superior con sonido y pantalla completa
│           ├── pedestal.html             # Pedestal 3D con tornamesa, ángulo azimuth y hotspots
│           ├── floating_specs.html       # HUD de telemetría en cuadrícula de 12 columnas
│           ├── carousel.html             # Selector horizontal inferior de modelos
│           ├── configurator_drawer.html  # Cajón lateral del configurador con cálculo de precios y reserva
│           ├── specs_modal.html          # Modal de ficha técnica completa
│           ├── matrix_modal.html         # Matriz de toda la flota con filtros
│           ├── search_modal.html         # Búsqueda instantánea (Cmd+K)
│           └── nav_drawer.html           # Menú Stuttgart y directorio editorial
│
├── static/                     # Archivos estáticos
│   ├── css/style.css           # Estilos de iluminación, pedestal y transiciones
│   ├── js/audio.js             # Motor de síntesis de audio Web Audio API (Flat-6 y switches)
│   ├── js/showroom.js          # Lógica interactiva cliente, tornamesa 3D y comunicación AJAX
│   └── cars/                   # Fotografías oficiales de los vehículos Porsche
│
├── requirements.txt            # Dependencias del proyecto
├── manage.py                   # Administrador de comandos Django
└── _legacy_react/              # Archivos originales de React archivados para referencia
```

---

## 📡 Endpoints del Sistema

### Vistas Web
- `/` : Showroom interactivo (modelo por defecto: 911 GT3 RS).
- `/model/<slug>/` : Acceso directo y permalink a un modelo específico (ej. `/model/taycan-turbo-gt/`).
- `/admin/` : Panel de control administrativo Django.

### API REST (JSON)
- `GET /api/cars/` : Listado de todos los modelos con especificaciones completas, colores, llantas y puntos clave.
- `GET /api/cars/<slug>/` : Ficha técnica detallada de un vehículo en formato JSON.
- `GET /api/search/?q=<término>` : Búsqueda dinámica de vehículos por modelo, serie, motor o potencia.
- `POST /api/inquiry/` : Registro de configuraciones de clientes y generación de código de reserva oficial.

---

## 🧪 Pruebas Automatizadas

Para ejecutar las pruebas del proyecto:
```bash
python manage.py test
```
Resultados:
- Modelos ORM y relaciones validadas.
- Respuestas HTTP 200 en vistas SSR.
- Endpoints de API REST verificados.
- Creación de reservas mediante POST con código de reserva confirmado.

