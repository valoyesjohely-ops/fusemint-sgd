# 📚 API Documentation - FUSEMINT SGD

## 🔐 Authentication

Todos los endpoints protegidos requieren un **Bearer Token** en el header:

```
Authorization: Bearer <token>
```

### Login

**POST** `/api/auth/login`

```json
{
  "identifier": "admin@fusemint.org",
  "password": "admin123"
}
```

`identifier` acepta correo o nombre de usuario (`username`).

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@fusemint.org",
    "role": "admin"
  }
}
```

### Register

**POST** `/api/auth/register`

```json
{
  "email": "newuser@fusemint.org",
  "password": "password123",
  "name": "Nuevo Usuario"
}
```

---

## 📁 Expedientes

### List All Expedientes

**GET** `/api/expedientes`

Headers: `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": 1,
    "numero": "EXP-2024-001",
    "titulo": "Proyecto Institucional",
    "descripcion": "Descripción del expediente",
    "estado": "activo",
    "fechaCreacion": "2024-01-15T10:30:00Z",
    "documentos": [
      {
        "id": 1,
        "nombre": "documento.pdf",
        "tipo": "application/pdf",
        "tamaño": 2048,
        "url": "http://localhost:3000/uploads/documento.pdf"
      }
    ]
  }
]
```

### Get Single Expediente

**GET** `/api/expedientes/:id`

Headers: `Authorization: Bearer <token>`

**Response (200):** Objeto expediente con documentos

### Create Expediente

**POST** `/api/expedientes`

Headers: `Authorization: Bearer <token>`

```json
{
  "numero": "EXP-2024-002",
  "titulo": "Nuevo Expediente",
  "descripcion": "Descripción aquí",
  "seccion_id": 1
}
```

**Response (201):**
```json
{
  "id": 2,
  "numero": "EXP-2024-002",
  "titulo": "Nuevo Expediente",
  "estado": "activo"
}
```

---

## 📄 Documentos

### List Documents in Expediente

**GET** `/api/expedientes/:expedienteId/documentos`

Headers: `Authorization: Bearer <token>`

**Response (200):** Array de documentos

### Upload Document

**POST** `/api/expedientes/:expedienteId/documentos`

Headers: `Authorization: Bearer <token>`

```json
{
  "nombre": "documento.pdf",
  "tipo": "application/pdf",
  "tamaño": 102400,
  "url": "http://localhost:3000/uploads/documento.pdf"
}
```

**Response (201):**
```json
{
  "id": 1,
  "expedienteId": 1,
  "nombre": "documento.pdf",
  "tipo": "application/pdf",
  "url": "http://localhost:3000/uploads/documento.pdf"
}
```

---

## 📊 Reportes

### Dashboard Stats

**GET** `/api/reportes/dashboard`

Headers: `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "totalExpedientes": 25,
  "expedientesActivos": 20,
  "documentosCargados": 150,
  "usuariosActivos": 5
}
```

---

## 🚨 Error Responses

### 401 Unauthorized
```json
{
  "error": "Token no proporcionado"
}
```

### 403 Forbidden
```json
{
  "error": "Token inválido"
}
```

### 404 Not Found
```json
{
  "error": "Recurso no encontrado"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error interno del servidor"
}
```

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fusemint.org","password":"admin123"}'
```

### Get Expedientes
```bash
curl -X GET http://localhost:3000/api/expedientes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Expediente
```bash
curl -X POST http://localhost:3000/api/expedientes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "numero":"EXP-2024-002",
    "titulo":"Test",
    "descripcion":"Test",
    "seccion_id":1
  }'
```

---

## 📖 Rate Limiting

Actualmente no implementado. Se recomienda añadir en producción.

---

## 🔄 API Versioning

Actual: `v1` (incluido en `/api`)

Futuras versiones usarán `/api/v2`, etc.
