# Tripflow

## Funcionalidades del Prototipo
- Diseño Mobile-first: Interfaz completamente responsiva que se adapta perfectamente a vistas móviles y de escritorio.
- Gráficos Dinámicos: Visualización interactiva de gastos con animaciones cinemáticas y scroll inteligente.
- Gestión de Gastos: Creación y eliminación de registros agrupados por categorías con íconos dinámicos.
- Gestión de Viajes: Interfaz funcional para registrar nuevos viajes calculando su presupuesto y duración.
- Arquitectura Vanilla: Máximo rendimiento usando HTML, CSS y JS nativo, sin frameworks pesados.

---

## Cómo ejecutar el proyecto localmente

Para explorar el proyecto en tu entorno local, asegúrate de tener Node.js (incluye npm) instalado y sigue estos sencillos pasos:

### 1. Clonar el repositorio
Si aún no lo has hecho, clona el proyecto y entra en la carpeta:
git clone https://github.com/StivenCeballos/tripflow-design-challenge.git
cd tripflow-design-challenge/tripflow

### 2. Instalar dependencias
Instala los paquetes necesarios para el servidor de desarrollo Vite:
npm install

### 3. Iniciar el servidor de desarrollo
Levanta la aplicación en tiempo real:
npm run dev

### 4. Abrir la aplicación
La terminal te mostrará una dirección local. Simplemente ingresa a ese enlace (usualmente http://localhost:5173/) desde tu navegador. 

Tip: Prueba abrir las herramientas de desarrollador (F12) y usar la vista de dispositivo móvil para apreciar la versión responsiva.

---

## Construcción para Producción

Si deseas empaquetar el proyecto para subirlo a un hosting estático (como Vercel, Netlify, o GitHub Pages), ejecuta:
npm run build

Vite agrupará y optimizará todo el código dentro de la carpeta dist/.
