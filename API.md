# 📚 API Documentation - FUSEMINT SGD

Base URL: `http://localhost:3000/api`

## 🔐 Autenticación

- `POST /auth/login`
- `POST /auth/register`

## 👥 Usuarios (solo admin)

- `GET /usuarios`
- `POST /usuarios`
- `PUT /usuarios/:id`
- `DELETE /usuarios/:id`

## 🔑 Permisos por expediente (solo admin)

- `POST /permisos-expediente`
- `GET /usuarios/:id/permisos`
- `PUT /permisos-expediente/:id`

## 🧩 Catálogos

CRUD dinámico para:

- `GET|POST|PUT|DELETE /catalogos/grupos-documentales`
- `GET|POST|PUT|DELETE /catalogos/tipos-operacion`
- `GET|POST|PUT|DELETE /catalogos/tipos-cliente`
- `GET|POST|PUT|DELETE /catalogos/tipos-documentales`
- `GET|POST|PUT|DELETE /catalogos/secciones`

> Para `PUT` y `DELETE`, usar `/:id`.

## 📁 Expedientes

- `GET /expedientes` (admite filtros: `grupo_documental`, `tipo_operacion`, `tipo_cliente`, `tipo_documental`, `seccion`, `estado`, `q`)
- `GET /expedientes/:id`
- `POST /expedientes`
- `PUT /expedientes/:id`
- `DELETE /expedientes/:id`

## 🏗️ Operaciones

- `POST /operaciones`
- `GET /operaciones/proyectos`
- `GET /operaciones/convenios`
- `GET /operaciones/contratos`

## 👤 Clientes

- `POST /clientes`
- `GET /clientes`
- `GET /clientes/:id`

## 📄 Documentos

- `POST /documentos` (multipart/form-data, campo archivo `archivo`)
- `GET /documentos/:id` (descarga)
- `DELETE /documentos/:id`
- `GET /expedientes/:id/documentos`

### Reglas de upload

- Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, JPEG, PNG
- Tamaño máximo: 50 MB
- Estructura de almacenamiento: `uploads/{tipo}/{expediente-id}/{seccion}/{archivo}`

## 🔍 Búsqueda

- `GET /busqueda?q=texto`
- `POST /busqueda/avanzada`
  - Filtros: `grupo_documental`, `tipo_operacion`, `tipo_cliente`, `tipo_documental`, `seccion`, `fecha_cargue`

## 📊 Dashboard

- `GET /dashboard/totales`
- `GET /dashboard/ultimos-documentos`

## ✅ Compatibilidad previa

- `GET /reportes/dashboard` (legacy)
