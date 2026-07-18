# 🚀 GUÍA DE INSTALACIÓN - FUSEMINT SGD

## 📋 Requisitos Previos

- **Node.js** v18+ ([Descargar](https://nodejs.org))
- **MySQL** 8.0+ ([Descargar](https://dev.mysql.com/downloads/mysql))
- **Git** ([Descargar](https://git-scm.com))
- **npm** o **yarn**

---

## 📥 PASO 1: Clonar el Repositorio a D:/

### Opción A: Con Git (RECOMENDADO)

```bash
# Abre PowerShell o CMD y ve a D:/
cd D:\

# Clona el repositorio
git clone https://github.com/valoyesjohely-ops/fusemint-sgd.git
cd fusemint-sgd
```

### Opción B: Descargar ZIP

1. Ve a: https://github.com/valoyesjohely-ops/fusemint-sgd
2. Haz click en **Code** → **Download ZIP**
3. Extrae en `D:\fusemint-sgd\`
4. Abre PowerShell y ve a esa carpeta

---

## 🗄️ PASO 2: Configurar Base de Datos MySQL

### 2.1 Abrir MySQL

```bash
# En PowerShell
mysql -u root -p
# Te pedirá contraseña (si tienes configurada)
```

### 2.2 Crear Base de Datos (Opcional - el script lo hace)

```sql
CREATE DATABASE fusemint_sgd;
USE fusemint_sgd;
```

### 2.3 Ejecutar el Schema

```bash
# Desde D:\fusemint-sgd
mysql -u root -p fusemint_sgd < backend/src/database/schema.sql
```

**Credenciales de prueba después de inicializar:**
- Email: `admin@fusemint.org`
- Password: `admin123`

---

## ⚙️ PASO 3: Configurar Variables de Entorno

### Backend

```bash
cd D:\fusemint-sgd\backend
cp .env.example .env
```

Edita `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=fusemint_sgd
DB_PORT=3306
JWT_SECRET=tu_secreto_aqui_cambiar_en_produccion
CORS_ORIGIN=http://localhost:5173
```

### Frontend

```bash
cd D:\fusemint-sgd\frontend
cp .env.example .env
```

Edita `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=FUSEMINT SGD
```

---

## 📦 PASO 4: Instalar Dependencias

### Backend

```bash
cd D:\fusemint-sgd\backend
npm install
```

### Frontend

```bash
cd D:\fusemint-sgd\frontend
npm install
```

---

## 🎯 PASO 5: Inicializar Base de Datos (Opcional)

```bash
cd D:\fusemint-sgd\backend
npm run db:init
```

Esto cargará automáticamente el schema y datos iniciales.

---

## 🚀 PASO 6: Iniciar los Servidores

### Terminal 1 - Backend

```bash
cd D:\fusemint-sgd\backend
npm run dev
```

**Deberías ver:**
```
✅ Connected to MySQL
✅ Database ready
🚀 Server running on http://localhost:3000
📚 API available at http://localhost:3000/api
```

### Terminal 2 - Frontend

```bash
cd D:\fusemint-sgd\frontend
npm run dev
```

**Deberías ver:**
```
  VITE v4.3.9  ready in 340 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🌐 PASO 7: Acceder a la Aplicación

1. Abre tu navegador
2. Ve a: **http://localhost:5173**
3. Inicia sesión con:
   - Email: `admin@fusemint.org`
   - Password: `admin123`

---

## 📝 Credenciales de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@fusemint.org | admin123 | admin |
| juan@fusemint.org | admin123 | gestor |
| maria@fusemint.org | admin123 | usuario |

---

## 🐛 Troubleshooting

### "Error: Cannot find module 'mysql2'"
```bash
# Reinstala dependencias
cd backend
rm -r node_modules package-lock.json
npm install
```

### "Port 3000 already in use"
```bash
# Cambia en backend/.env
PORT=3001
```

### "Connection refused"
- Asegúrate de que MySQL está ejecutándose
- Verifica las credenciales en `.env`

### "CORS error"
- Verifica que `CORS_ORIGIN` en backend/.env coincida con tu frontend URL

---

## 📚 Documentación Adicional

- [API Documentation](./API.md)
- [Database Schema](./backend/src/database/schema.sql)
- [Architecture Guide](./ARCHITECTURE.md)

---

## ✅ Verificación de Instalación

Ejecutar esto en PowerShell para verificar:

```bash
echo "Verificando instalación..."
echo "✓ Node.js version:"
node --version
echo "✓ npm version:"
npm --version
echo "✓ MySQL version:"
mysql --version
echo "\n✅ Todas las herramientas están instaladas!"
```

---

**¡Listo! Tu aplicación FUSEMINT SGD está funcionando en localhost! 🎉**
