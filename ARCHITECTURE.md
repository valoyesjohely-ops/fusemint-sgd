# 🏗️ ARCHITECTURE - FUSEMINT SGD

## 📐 Project Structure

```
fusemint-sgd/
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── DocumentViewer.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/            # React Context (Auth, Theme)
│   │   │   └── AuthContext.tsx
│   │   ├── pages/               # Páginas principales
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Expedientes.tsx
│   │   │   └── Documentos.tsx
│   │   ├── services/            # API calls
│   │   │   └── api.ts
│   │   ├── lib/                 # Utilidades
│   │   │   └── utils.ts
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # Node.js + Express + MySQL
│   ├── src/
│   │   ├── server.ts            # Express app + routes
│   │   ├── middleware/          # Auth, logging
│   │   │   └── auth.ts
│   │   ├── database/
│   │   │   ├── init.ts          # Database initialization
│   │   │   ├── schema.sql       # Tables definition
│   │   │   └── initial-data.sql # Seed data
│   │   └── utils/
│   │       └── helpers.ts       # Helper functions
│   ├── dist/                    # Compiled JS
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── INSTALL.md               # Guía de instalación
│   ├── API.md                   # API documentation
│   └── ARCHITECTURE.md          # Este archivo
│
└── README.md                    # Proyecto overview
```

---

## 🔄 Data Flow

### Authentication Flow

```
┌─────────────────────────────────────────────┐
│ 1. Usuario entra credenciales en Login.tsx  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 2. POST /api/auth/login (backend)           │
│    - Verificar email en DB                  │
│    - Comparar password (bcrypt)             │
│    - Generar JWT token                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 3. Guardar token en localStorage            │
│    - Pasar usuario a AuthContext            │
│    - Redirigir a /dashboard                 │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 4. Cada request incluye:                    │
│    Authorization: Bearer <token>            │
└─────────────────────────────────────────────┘
```

### Document Management Flow

```
┌─────────────────────────────────────────────┐
│ Usuario ve lista de Expedientes             │
│ (GET /api/expedientes)                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ DocumentoViewer Modal                       │
│ - PDF: iframe src=url                       │
│ - Image: <img src=url>                      │
│ - Text: iframe src=url                      │
│ - Other: Offer download button              │
└──────────────┬──────────────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
   Ver        Descargar (A href)
 Document    Document
```

---

## 🗄️ Database Schema

```
Usuarios
├── id (PK)
├── nombre
├── email (UNIQUE)
├── password (hashed)
├── rol (admin|gestor|usuario)
└── timestamps

Expedientes
├── id (PK)
├── numero (UNIQUE)
├── titulo
├── descripcion
├── seccion_id (FK)
├── estado (activo|inactivo)
└── timestamps

Documentos
├── id (PK)
├── expediente_id (FK)
├── nombre
├── tipo
├── tamaño
├── url
└── timestamps

Operaciones
├── id (PK)
├── tipo (proyecto|convenio|contrato)
├── numero (UNIQUE)
└── timestamps

Auditoria
├── id (PK)
├── tabla
├── operacion (INSERT|UPDATE|DELETE)
├── registro_id
├── usuario_id (FK)
├── datos_anteriores (JSON)
├── datos_nuevos (JSON)
└── fecha_cambio
```

---

## 🎨 Component Hierarchy

```
App
├── AuthProvider
│   └── Router
│       ├── /login → Login
│       ├── /dashboard → DashboardLayout
│       │   ├── Header
│       │   ├── Sidebar
│       │   └── Dashboard
│       ├── /expedientes → DashboardLayout
│       │   ├── Header
│       │   ├── Sidebar
│       │   └── Expedientes
│       │       └── DocumentViewer
│       └── /documentos → Documentos
```

---

## 🔐 Security Considerations

### Frontend
- ✅ Passwords never logged
- ✅ Token stored in localStorage (consider sessionStorage for higher security)
- ✅ Routes protected with ProtectedRoute component
- ✅ Auto-redirect to login on 401

### Backend
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 24h expiration
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configured
- ✅ Token verification on protected routes

### Production Recommendations
- 🔒 Use environment variables for secrets
- 🔒 Enable HTTPS/TLS
- 🔒 Implement rate limiting
- 🔒 Add request logging and monitoring
- 🔒 Use refresh tokens
- 🔒 Implement file upload validation

---

## 🚀 Performance Optimizations

### Frontend
- React Context instead of prop drilling
- Lazy loading of pages (can be added)
- Memoization of expensive computations
- CSS-in-JS (Tailwind) for minimal bundle

### Backend
- Connection pooling (10 connections)
- Indexed database queries
- Response caching (can be added)
- Gzip compression (can be added)

---

## 📈 Scalability Roadmap

### Phase 1 (Current)
- Single MySQL database
- Single Node.js server
- File uploads to local disk

### Phase 2
- Add Redis for caching
- Implement message queue (RabbitMQ/Kafka)
- S3/Cloud storage for files
- Database read replicas

### Phase 3
- Kubernetes deployment
- Microservices architecture
- GraphQL API
- Advanced reporting engine

---

## 🧪 Testing Strategy

### Frontend Tests (Jest + React Testing Library)
- Component rendering
- User interactions
- Authentication flow

### Backend Tests (Jest + Supertest)
- Route handlers
- Database operations
- Authentication middleware

### E2E Tests (Cypress/Playwright)
- Complete user workflows
- Multi-page scenarios

---

## 📚 Tech Stack Summary

| Layer | Technology | Version |
|-------|------------|----------|
| Frontend | React | 18.2.0 |
| Build Tool | Vite | 4.3.9 |
| Styling | Tailwind CSS | 3.3.2 |
| Router | Wouter | 3.0.0 |
| Backend | Express | 4.18.2 |
| Database | MySQL | 8.0+ |
| ORM | mysql2/promise | 3.6.0 |
| Auth | JWT | 9.0.2 |
| Hashing | Bcrypt | 5.1.0 |
| Language | TypeScript | 5.1.3 |
| Runtime | Node.js | 18.0+ |
