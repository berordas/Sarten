# Sartén

Frontend de una plataforma web de subastas online, desarrollado con Next.js (App Router) y React. Permite a los usuarios explorar, crear y participar en subastas, pujar, comentar y valorar, con autenticación mediante JWT contra una API REST propia.

## Funcionalidades

- **Autenticación:** registro (con selección de provincia/localidad) e inicio de sesión con JWT, sesión persistida en `localStorage`.
- **Listado de subastas:** búsqueda por texto, filtrado por rango de precio y categoría.
- **Detalle de subasta:** información del artículo, sistema de pujas, comentarios (crear/editar/eliminar) y valoraciones (crear/editar/eliminar).
- **Gestión de subastas propias:** crear, editar y eliminar subastas (`/create`, `/edit/[id]`, `/myAuctions`).
- **Mis pujas:** listado de todas las pujas realizadas por el usuario (`/myBids`).
- **Perfil de usuario:** consulta de datos y cambio de contraseña (`/me`).

## Estructura del proyecto

```
Sarten/
├── app/
│   ├── (appContent)/
│   │   ├── auctions/        # Listado y búsqueda de subastas
│   │   ├── detalle/[id]/    # Detalle de subasta: pujas, comentarios, valoraciones
│   │   ├── me/               # Perfil de usuario
│   │   ├── myAuctions/        # Subastas creadas por el usuario
│   │   └── myBids/            # Pujas realizadas por el usuario
│   ├── create/               # Creación de subastas
│   ├── edit/[id]/            # Edición de subastas
│   ├── login/                 # Inicio de sesión
│   ├── register/              # Registro de usuario
│   └── layout.js / page.js
├── components/                # Componentes reutilizables (Card, Button, Header, Footer, etc.)
└── public/                    # Recursos estáticos
```

Cada ruta sigue el mismo patrón: `page.js` (UI) + `utils.js` (llamadas a la API).

## Tecnologías

- **Next.js 15** (App Router) y **React 19**
- **CSS Modules** para estilos por componente
- **JWT** para autenticación, gestionado vía `localStorage`
- **API REST** externa (Django) desplegada en Render: `https://sarten-backend.onrender.com/api/`
- **ESLint** para linting
- Despliegue en **Vercel**

## Requisitos

- Node.js 18+
- npm / yarn / pnpm / bun

## Instalación y uso

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

Otros scripts disponibles:

```bash
npm run build   # build de producción
npm run start   # servir el build de producción
npm run lint     # lint del proyecto
```

## Backend

Esta aplicación consume una API REST externa ya desplegada (`sarten-backend.onrender.com`), por lo que no requiere configuración adicional de backend ni variables de entorno para funcionar en local.
