# Tripflow

Tripflow es una aplicación web moderna diseñada para la administración, control y visualización de presupuestos y gastos de viajes. Está construida bajo una arquitectura *Vanilla Web* enfocada al altísimo rendimiento y una experiencia de usuario sumamente fluida e interactiva.

Puedes ver una versión demo en vivo aquí: https://tripflow-design-challenge.vercel.app

## Características Principales

- **Diseño Mobile-first y Responsive**: Interfaces adaptables inspiradas en las mejores prácticas de Figma, brindando una experiencia "App-like" desde el navegador.
- **Gráficos Dinámicos de Gastos**: Barras y ejes que calculan automáticamente su escala, con renderizado cinemático (`requestAnimationFrame`), compresión inteligente de días inactivos y scroll suave personalizado.
- **Arquitectura Ligera**: Componentes dinámicos renderizados exclusivamente con Vanilla JavaScript, garantizando cargas ultrarrápidas sin el peso de librerías como React o Vue.

## Tecnologías Utilizadas

- **HTML5 & CSS3 Vanilla**: Sistema de diseño basado en Custom Properties y CSS Grid.
- **Vanilla JS (ES6+)**: Gestión de estado nativo e inyección en el DOM.
- **Vite**: Servidor de desarrollo ultra rápido y empaquetador (bundler).
- **Phosphor Icons**: Íconos modernos importados de forma nativa.

---

## Cómo ejecutar el proyecto localmente

Para explorar el proyecto en tu entorno local, asegúrate de tener [Node.js](https://nodejs.org/) (incluye npm) instalado y sigue estos sencillos pasos:

### 1. Clonar el repositorio
Si aún no lo has hecho, clona el proyecto y entra en la carpeta:
```bash
git clone https://github.com/StivenCeballos/tripflow-design-challenge.git
cd tripflow-design-challenge/tripflow
```
*(Nota: ajusta la ruta si la carpeta raíz se llama diferente en tu sistema)*

### 2. Instalar dependencias
Instala los paquetes necesarios para el servidor de desarrollo Vite:
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
Levanta la aplicación en tiempo real:
```bash
npm run dev
```

### 4. Abrir la aplicación
La terminal te mostrará una dirección local. Simplemente haz `Ctrl + Clic` en el enlace (usualmente **`http://localhost:5173/`**) para ver la aplicación en tu navegador. 

*Tip: Prueba abrir las herramientas de desarrollador (`F12`) y usar la vista de dispositivo móvil para apreciar la versión responsiva.*

---


