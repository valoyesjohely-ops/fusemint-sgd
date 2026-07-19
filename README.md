# 🎯 FUSEMINT SGD - Sistema de Gestión Documental

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-blue.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8+-blue.svg)](https://www.mysql.com)

## 📋 Descripción

**FUSEMINT SGD** es un Sistema de Gestión Documental profesional diseñado para instituciones colombianas que necesitan:

✅ Organizar expedientes documentales
✅ Gestionar documentos (PDF, imágenes, texto)
✅ Visualizar documentos sin descargar
✅ Control de acceso por roles
✅ Auditoría completa de cambios
✅ Reportes y estadísticas

---

## 🎨 Características Principales

### Frontend
- ✨ Interfaz moderna con Tailwind CSS
- 🟢 Diseño verde institucional (`#1B6D3B`)
- 📱 Responsive (móvil, tablet, desktop)
- 🔐 Autenticación JWT
- 👤 Control de roles (admin, usuario)
- 📄 Visor de documentos integrado
- 🔍 Búsqueda en tiempo real
- 📊 Dashboard con estadísticas

### Backend
- ⚡ API REST con Express.js
- 🗄️ Base de datos MySQL con auditoría
- 🔑 Autenticación JWT con bcrypt
- 📁 Gestión de expedientes y documentos
- 📈 Reportes y estadísticas
- 🔒 Validación y seguridad
- 📝 Logs de auditoría completos

---

## 🚀 Quick Start

### 1️⃣ Clonar el Repositorio

```bash
cd D:\
git clone https://github.com/valoyesjohely-ops/fusemint-sgd.git
cd fusemint-sgd
```

### 2️⃣ Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3️⃣ Configurar Base de Datos

```bash
# Importar schema
mysql -u root -p fusemint_sgd < ../backend/src/database/schema.sql
```

### 4️⃣ Configurar Variables de Entorno

```bash
# Backend
cd backend
cp .env.example .env
# Edita .env con tus credenciales MySQL

# Frontend
cd ../frontend
cp .env.example .env
```

### 5️⃣ Iniciar Servidores

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6️⃣ Acceder a la Aplicación

🌐 **http://localhost:5173**

**Credenciales de prueba:**
- Email: `admin@fusemint.org`
- Password: `admin123`

---

## 📚 Documentación

- 📖 [Guía de Instalación Completa](./INSTALL.md)
- 📚 [API Documentation](./API.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)

---

## 🗂️ Estructura del Proyecto

```
fusemint-sgd/
├── frontend/              # React + Tailwind
│   ├── src/
│   │   ├── components/   # Componentes UI
│   │   ├── contexts/     # Auth context
│   │   ├── pages/        # Páginas principales
│   │   ├── services/     # API calls
│   │   └── App.tsx
│   └── package.json
├── backend/              # Express + MySQL
│   ├── src/
│   │   ├── server.ts     # Rutas principales
│   │   ├── middleware/   # Auth middleware
│   │   ├── database/     # Schema y datos
│   │   └── utils/        # Helpers
│   └── package.json
└── docs/
    ├── INSTALL.md
    ├── API.md
    └── ARCHITECTURE.md
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación
- [x] Login
- [x] Registro
- [x] JWT tokens
- [x] Protected routes

### ✅ Expedientes
- [x] Listar expedientes
- [x] Crear expediente
- [x] Ver detalles
- [x] Actualizar estado

### ✅ Documentos
- [x] Subir documentos
- [x] Visualizar documentos (PDF, imágenes, texto)
- [x] Descargar documentos
- [x] Eliminar documentos

### ✅ Dashboard
- [x] Estadísticas en tiempo real
- [x] Gráficos de actividad
- [x] Acciones rápidas

### ✅ Seguridad
- [x] Hashing de passwords
- [x] JWT authentication
- [x] Role-based access control
- [x] SQL injection prevention

---

## 🔐 Seguridad

✅ **Passwords:** Hasheadas con bcrypt (10 rounds)
✅ **Tokens:** JWT con 24h expiration
✅ **Queries:** Parameterized para evitar SQL injection
✅ **CORS:** Configurado para localhost
✅ **Roles:** Validación en backend y frontend (Administrador/Usuario)

---

## 🚀 Deployment

### Production Checklist

- [ ] Cambiar `JWT_SECRET` en `.env`
- [ ] Usar `HTTPS` en lugar de HTTP
- [ ] Configurar `NODE_ENV=production`
- [ ] Setup de base de datos con backups
- [ ] Implementar rate limiting
- [ ] Añadir logging y monitoring
- [ ] Usar variables de entorno seguras
- [ ] Configurar CORS para dominio real

---

## 📱 Credenciales de Prueba

> ⚠️ Solo para desarrollo local. Cambia estas credenciales en cualquier entorno real.

```
┌─────────────────────┬────────────┬──────────┐
│ Email               │ Password   │ Rol      │
├─────────────────────┼────────────┼──────────┤
│ admin@fusemint.org    │ admin123   │ admin    │
│ usuario@fusemint.org  │ admin123   │ usuario  │
└─────────────────────┴────────────┴──────────┘
```

---

## 🛠️ Tech Stack

**Frontend:**
- React 18.2
- Vite
- Tailwind CSS
- TypeScript
- Wouter (routing)

**Backend:**
- Node.js
- Express.js
- MySQL 8
- JWT
- Bcrypt
- TypeScript

---

## 📊 Database Schema

Ver `backend/src/database/schema.sql` para detalles completos.

**Tablas principales:**
- `usuarios` - Usuarios del sistema
- `expedientes` - Expedientes documentales
- `grupos_documentales` - Catálogo de información general / operaciones / servicios
- `tipos_operacion` - Proyecto / Convenio / Contrato
- `tipos_cliente` - Persona Jurídica / Persona Natural
- `documentos` - Documentos asociados
- `auditoria` - Logs de cambios

**Clasificaciones clave en expedientes:**
- Operaciones celebradas: Proyecto, Convenio, Contrato
- Servicios contables: Persona Jurídica, Persona Natural
- Secciones de operación: Técnica, Financiera, Legal

---

## 🐛 Solución de Problemas

### Puerto 3000 ocupado
```bash
# Cambiar puerto en backend/.env
PORT=3001
```

### MySQL connection error
```bash
# Verificar credenciales en backend/.env
# Asegurar que MySQL está ejecutándose
mysql -u root -p
```

### Módulos no encontrados
```bash
# Reinstalar dependencias
rm -r node_modules package-lock.json
npm install
```

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la documentación en `/docs`
2. Verifica los logs en la consola
3. Abre un issue en GitHub

---

## 📄 Licencia

MIT License - Ver `LICENSE` para detalles

---

## 🎉 ¡Listo!

Ya tienes **FUSEMINT SGD** funcionando en tu máquina. 

**Próximos pasos:**
1. Explora el dashboard
2. Crea expedientes
3. Sube documentos
4. Prueba la visualización de documentos
5. Configura usuarios adicionales

¡Disfruta! 🚀
