# Moon-Go | Sistema de Arriendo de Vehículos

# Integrantes del Proyecto
* **Ismael Figueroa**
* **Francisco Miranda**

# Tecnologías Utilizadas
#   Backend: Python & Django Framework.
#  Base de Datos: SQLite (desarrollo local) con ORM de Django.
#   Frontend: HTML5, CSS3 personalizado con variables globales, Bootstrap 5.3 y Bootstrap Icons.


# Declaración y Citación del Uso de Inteligencia Artificial (IA)

#  En conformidad con las buenas prácticas académicas, éticas y de desarrollo de software, se declara que para este proyecto se utilizó #     asistencia de Inteligencia Artificial como herramienta de apoyo y programación en pareja (*pair programming*).

# Herramienta Utilizada
# Modelo / Asistente: Antigravity (Google DeepMind) con modelo Claude Sonnet 4.6 (Thinking).

# Propósito y Alcance del Uso de la IA #

# La IA fue empleada puntualmente en las siguientes tareas:
1. **Diseño de Interfaz y CSS Modular:**
   * Creación de la arquitectura CSS ([`static/css/style.css`](static/css/style.css)) tomando como referencia visual y estructural el portal corporativo de **Avis Chile** (paleta de colores, tarjetas de flota con elevación, tipografía, navbar institucional y formulario de búsqueda).
   * Implementación de un sistema de diseño basado en variables CSS (`:root`), permitiendo modificar colores institucionales y estilos globales de manera centralizada.
2. **Estructura y Maquetación de Plantillas HTML:**
   * Diseño de plantillas Django ([`auto_lista.html`](templates/autos/auto_lista.html), [`auto_detalle.html`](templates/autos/auto_detalle.html), [`gestion_autos.html`](templates/autos/gestion_autos.html), [`login.html`](templates/registration/login.html), etc.) para desplegar la información del catálogo, filtros de búsqueda y acciones administrativas.
3. **Orientación en arquitectura de la app `reservas`** *(modo pair programming — sin escritura de código por parte de la IA)*:
   * Identificación de los archivos a crear/modificar para implementar el flujo de arriendo de autos por parte de clientes.
   * Guía sobre la implementación de `forms.py`, `views.py`, `urls.py` de la app `reservas`, registro en `moongo/urls.py`, creación de templates y lógica de filtrado por usuario (`Reserva.objects.filter(usuario=request.user)`).
   * Orientación para modificar el botón "Solicitar Reserva" en [`auto_detalle.html`](templates/autos/auto_detalle.html) para enlazarlo con la vista `reservas:crear` usando `{% url %}` con el slug del auto.

> **Nota:** La lógica de negocio, arquitectura de modelos en base de datos (`Auto`, `User`, `Reserva`), validaciones de formularios y control de permisos fueron diseñadas y supervisadas por los autores del proyecto.

---

## 💬 Prompts utilizados con la IA (esta sesión)

Los siguientes son los prompts exactos enviados al asistente Antigravity durante la sesión de desarrollo del módulo de reservas:

> **Prompt 1:**
> *(No necesito que hagas el trabajo, solo que me orientes en qué hacer, en qué archivos)*
> Quiero poder hacer que los clientes puedan registrar arriendos (reservas) de autos y que puedan ver únicamente las que ellos hicieron

> **Prompt 3:**
> Podrías citarte y además adjuntar el prompt que usé en esta conversación en el readme?

---

## ⚙️ Instrucciones de Instalación y Ejecución

1. **Clonar o situarse en el directorio del proyecto:**
   ```bash
   cd "ProyectoBackend-ev3"
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecutar migraciones de la base de datos:**
   ```bash
   python manage.py migrate
   ```

4. **(Opcional) Crear superusuario para el panel de administración:**
   ```bash
   python manage.py createsuperuser
   ```

5. **Iniciar el servidor local:**
   ```bash
   python manage.py runserver
   ```
   Acceder desde el navegador a: `http://127.0.0.1:8000/`

---

## 📌 Rutas Principales
* `/` o `/autos/`: Catálogo de autos y reservas.
* `/autos/auto/<slug>/`: Ficha técnica y detalle de arriendo.
* `/autos/gestion/`: Panel de gestión de flota (exclusivo administradores/staff).
* `/login/`: Inicio de sesión de usuarios.
* `/registrar/`: Creación de nuevas cuentas de clientes.
* `/admin/`: Panel de administración nativo de Django.

