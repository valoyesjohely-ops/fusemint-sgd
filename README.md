# FUSEMINT SGD - Sistema de Gestión Documental

Sistema de gestión documental basado en expedientes para la Fundación FUSEMINT.

## 📋 Descripción

FUSEMINT SGD es una plataforma moderna y profesional para administrar, organizar, clasificar y consultar documentos digitales mediante expedientes documentales, facilitando la gestión de la información institucional de la Fundación.

### Características principales

- ✅ Gestión de expedientes documentales
- ✅ Clasificación de documentos por secciones (Técnica, Financiera, Legal)
- ✅ Control de acceso granular por expediente
- ✅ Búsqueda avanzada con filtros
- ✅ Auditoría completa de cambios
- ✅ Interfaz moderna y responsive

## 🏗️ Estructura del Proyecto

```
fusemint-sgd/
├── frontend/                    # Angular 20 + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Servicios, guards, interceptores
│   │   │   ├── shared/         # Componentes reutilizables
│   │   │   ├── modules/        # Módulos funcionales
│   │   │   ├── layout/         # Layout principal
│   │   │   └── app.module.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   └── styles/
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
├── backend/                     # Node.js + Express
│   ├── src/
│   │   ├── controllers/         # Controladores de rutas
│   │   ├── services/           # Lógica de negocio
│   │   ├── routes/             # Definición de rutas
│   │   ├── middleware/         # Middlewares (auth, validation)
│   │   ├── models/             # Tipos e interfaces
│   │   ├── config/             # Configuración
│   │   ├── database/           # Conexión a BD
│   │   └── index.ts            # Punto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── database/
│   ├── schema.sql              # Schema mejorado
│   └── initial-data.sql        # Datos iniciales
├── docs/
│   ├── SPECIFICATION.md        # Especificación del proyecto
│   ├── API.md                  # Documentación API REST
│   └── DATABASE.md             # Documentación de BD
└── .gitignore
```

## 🛠️ Stack Tecnológico

### Frontend
- **Angular 20** - Framework principal
- **Tailwind CSS** - Estilos
- **TypeScript** - Lenguaje
- **SCSS** - Preprocesador CSS
- **RxJS** - Programación reactiva

### Backend
- **Node.js 18+** - Runtime
- **Express** - Framework HTTP
- **TypeScript** - Lenguaje
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas

### Base de Datos
- **MySQL 8.0+** - Base de datos relacional

## 📦 Instalación

### Requisitos previos
- Node.js 18+
- npm o yarn
- MySQL 8.0+

### Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Backend

```bash
cd backend
npm install

# Crear archivo .env con las variables requeridas
cp .env.example .env

# Ejecutar en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Base de Datos

```bash
# Crear base de datos y ejecutar schema
mysql -u root -p < database/schema.sql
mysql -u root -p < database/initial-data.sql
```

## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** con contraseñas cifradas mediante **bcrypt**.

### Flujo de autenticación

1. Usuario inicia sesión con usuario + contraseña
2. Backend valida credenciales en MySQL
3. Si son válidas, genera JWT
4. Frontend almacena el token
5. Todas las peticiones incluyen el token en el header `Authorization: Bearer <token>`
6. Backend verifica el token y los permisos del expediente

## 📊 Base de Datos

Ver `docs/DATABASE.md` para documentación completa del schema.

## 🔗 API REST

Ver `docs/API.md` para documentación de endpoints.

## 📋 Especificación

Ver `docs/SPECIFICATION.md` para requisitos detallados del sistema.

## 👥 Roles y Permisos

### Administrador
- Acceso total al sistema
- Gestión de usuarios
- Crear/editar/eliminar expedientes
- Asignar permisos
- Acceder a todos los módulos

### Usuario
- Acceso limitado según permisos asignados
- Visualizar expedientes autorizados
- Cargar/editar/descargar documentos (según permisos)
- No puede administrar usuarios ni el sistema

## 📝 Licencia

Proyecto propietario de FUSEMINT

## 👤 Autor

Johely Valoyes - Pasantía Universitaria
