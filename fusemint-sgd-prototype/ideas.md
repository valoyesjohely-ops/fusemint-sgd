# Conceptualización de Diseño - FUSEMINT SGD

## Referencia de Proyecto
Sistema de Gestión Documental institucional para FUSEMINT (fundación colombiana). Inspiración: OneDrive/Google Drive adaptado a contexto institucional. Tecnología: Angular Material + React/Tailwind. Paleta: Verdes institucionales + Grises.

---

## Tres Enfoques Propuestos

### 1. **Minimalismo Corporativo Escandinavo**
Enfoque limpio, espacios amplios, tipografía clara. Énfasis en la funcionalidad sin ornamentación.
**Probabilidad: 0.07**

### 2. **Institucionalismo Verde Moderno**
Paleta verde vibrante con grises cálidos. Diseño que transmite confianza, profesionalismo y sostenibilidad ambiental (alineado con FUSEMINT).
**Probabilidad: 0.08**

### 3. **Utilitarismo Elegante con Profundidad**
Interfaz funcional con capas visuales sutiles: sombras suaves, micro-interacciones fluidas, tipografía jerarquizada. Inspirado en plataformas SaaS premium.
**Probabilidad: 0.06**

---

## Enfoque Seleccionado: **Institucionalismo Verde Moderno**

Este enfoque refleja la identidad de FUSEMINT (gestión ambiental y contable) mientras mantiene profesionalismo y usabilidad.

### Movimiento de Diseño
**Diseño Institucional Contemporáneo** con influencias de:
- Material Design 3 (Angular Material)
- Sostenibilidad visual (verdes naturales)
- Plataformas SaaS modernas (OneDrive, Google Drive)

### Principios Fundamentales
1. **Claridad Jerárquica**: La navegación y la información se organizan en capas claras (módulos → expedientes → documentos)
2. **Confianza Institucional**: Colores verdes transmiten sostenibilidad y profesionalismo; grises neutros evitan distracción
3. **Eficiencia Operativa**: Minimizar pasos para acceder a documentos; buscador global siempre visible
4. **Escalabilidad Visual**: El diseño crece con el volumen de datos sin saturación

### Filosofía de Colores
- **Verde Institucional** (`#1B6D3B` / `oklch(0.45 0.15 142)`): Primario. Transmite confianza, profesionalismo, sostenibilidad ambiental
- **Verde Claro** (`#E8F5E9` / `oklch(0.95 0.02 142)`): Fondos, hover states
- **Gris Oscuro** (`#2C3E50` / `oklch(0.28 0.02 260)`): Textos, elementos principales
- **Gris Neutro** (`#F5F7FA` / `oklch(0.97 0.01 260)`): Fondos secundarios, separadores
- **Blanco** (`#FFFFFF`): Fondos principales, tarjetas

**Razonamiento**: Verde evoca sostenibilidad (misión de FUSEMINT); grises mantienen profesionalismo sin frivolidad.

### Paradigma de Diseño
**Estructura Jerárquica Sidebar + Contenido Principal**:
- Sidebar izquierdo (fijo, colapsable): Navegación principal (Información General, Operaciones Celebradas, Servicios Contables)
- Barra superior: Logo + Buscador Global + Perfil de usuario
- Área de contenido: Breadcrumbs, vista principal, panel de filtros (colapsable a la derecha)
- Pie de página: Información institucional (opcional)

### Elementos Distintivos
1. **Tarjetas de Expediente**: Diseño limpio con código, nombre, tipo de operación, estado visual (color del tipo)
2. **Carpetas Jerárquicas**: Iconografía clara (carpeta técnica, financiera, legal) con indicadores de contenido
3. **Buscador Global Prominente**: Barra de búsqueda en la parte superior con sugerencias en tiempo real
4. **Filtros Avanzados**: Panel lateral derecho (colapsable) con filtros por grupo documental, tipo de operación, etc.

### Filosofía de Interacción
- **Transiciones Suaves**: Cambios de vista con fade/slide suave (200-300ms)
- **Hover States Claros**: Cambio de color de fondo (verde claro) + cursor pointer
- **Feedback Inmediato**: Toasts para confirmaciones, errores, éxito
- **Navegación Intuitiva**: Breadcrumbs siempre visibles; botón "Atrás" en vistas de detalle

### Directrices de Animación
- **Entrada de Componentes**: Fade-in + slide-up suave (250ms, ease-out)
- **Hover en Elementos Interactivos**: Color de fondo a verde claro (150ms)
- **Transiciones de Ruta**: Fade entre páginas (200ms)
- **Modales y Diálogos**: Escala desde 0.95 + fade-in (300ms)
- **Listas y Tablas**: Stagger de filas (30-50ms entre elementos)

### Sistema Tipográfico
- **Titulares (Display)**: `Poppins Bold` (700) - Títulos de página, nombres de expedientes
- **Subtítulos (Heading)**: `Poppins SemiBold` (600) - Títulos de secciones
- **Cuerpo (Body)**: `Inter Regular` (400) - Texto principal, descripciones
- **Etiquetas (Label)**: `Inter Medium` (500) - Labels de formularios, metadatos
- **Monoespaciado (Code)**: `JetBrains Mono` - Códigos de expediente, referencias

**Jerarquía de Tamaños**:
- H1: 32px (títulos principales)
- H2: 24px (títulos de sección)
- H3: 18px (subtítulos)
- Body: 14px (texto principal)
- Small: 12px (metadatos, fechas)

### Esencia de Marca
**Posicionamiento**: *Sistema de gestión documental institucional que simplifica la organización y búsqueda de expedientes para fundaciones y entidades públicas, combinando profesionalismo con facilidad de uso.*

**Personalidad**: Confiable, Eficiente, Moderno

### Voz de Marca
**Tono**: Profesional pero accesible. Directo, sin jerga innecesaria.

**Ejemplos**:
- ✅ "Buscar expedientes por tipo de operación"
- ✅ "Documento cargado exitosamente"
- ❌ "Bienvenido a nuestro sistema"
- ❌ "Comience su viaje documental"

### Concepto de Logotipo
**Marca Gráfica**: Símbolo abstracto que combina:
- Forma de carpeta (gestión documental)
- Hoja estilizada (sostenibilidad ambiental)
- Líneas que sugieren organización jerárquica

**Colores**: Verde institucional + Gris oscuro
**Estilo**: Geométrico, minimalista, escalable

### Color de Firma de Marca
**Verde Institucional FUSEMINT**: `#1B6D3B` (oklch(0.45 0.15 142))
Este verde es inconfundible y se usa en botones primarios, enlaces, elementos de énfasis.

---

## Estructura de Navegación

```
┌─────────────────────────────────────────┐
│  FUSEMINT Logo  │  🔍 Buscador Global  │  👤 Perfil
└─────────────────────────────────────────┘
┌──────────────────┬──────────────────────┐
│                  │                      │
│  SIDEBAR         │   CONTENIDO PRINCIPAL│
│  ────────────    │   ────────────────   │
│  📋 Información  │   Breadcrumbs        │
│     General      │                      │
│                  │   Vista Principal    │
│  📁 Operaciones  │   (Expedientes,      │
│     Celebradas   │    Documentos, etc)  │
│     ├ Proyectos  │                      │
│     ├ Convenios  │   ┌────────────────┐ │
│     └ Contratos  │   │ Filtros (⊟)    │ │
│                  │   │ Avanzados      │ │
│  💼 Servicios    │   └────────────────┘ │
│     Contables    │                      │
│                  │                      │
│  ⚙️ Admin        │                      │
│  (si aplica)     │                      │
└──────────────────┴──────────────────────┘
```

---

## Flujos Principales

### 1. Acceso a Operaciones Celebradas
Usuario → Click "Operaciones Celebradas" → Selecciona tipo (Proyectos/Convenios/Contratos) → Ve lista de expedientes → Click en expediente → Vista resumen → Accede a carpetas (Técnica/Financiera/Legal) → Ve documentos

### 2. Búsqueda Global
Usuario → Escribe en buscador → Ve sugerencias en tiempo real → Selecciona resultado → Navega a expediente/documento

### 3. Registro de Expediente
Usuario → Click "Nuevo Expediente" → Selecciona grupo documental → Completa formulario dinámico → Guarda → Confirmación

### 4. Carga de Documento
Usuario → Navega a expediente → Selecciona carpeta → Click "Cargar Documento" → Completa formulario → Sube archivo → Confirmación

---

## Especificaciones Técnicas (Implementación)

### Stack
- **Frontend**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Componentes**: Angular Material-inspired (botones, inputs, selects, tablas)
- **Iconografía**: Lucide React
- **Animaciones**: Framer Motion (transiciones suaves)
- **Formularios**: React Hook Form + Zod

### Breakpoints Responsive
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Paleta de Colores (CSS Variables)
```css
--color-primary: #1B6D3B (Verde Institucional)
--color-primary-light: #E8F5E9 (Verde Claro)
--color-text-dark: #2C3E50 (Gris Oscuro)
--color-text-light: #7A8FA3 (Gris Claro)
--color-bg-secondary: #F5F7FA (Gris Neutro)
--color-border: #E0E6ED (Gris Borde)
--color-success: #4CAF50 (Verde Éxito)
--color-warning: #FFA726 (Naranja Advertencia)
--color-error: #EF5350 (Rojo Error)
```

---

## Próximas Fases

1. ✅ Conceptualización (Completado)
2. 🔄 Implementación de componentes base (Sidebar, Header, Buscador)
3. 🔄 Desarrollo de módulos (Información General, Operaciones Celebradas, Servicios Contables)
4. 🔄 Formularios dinámicos (Expedientes, Documentos)
5. 🔄 Buscador avanzado con filtros
6. 🔄 Administración de usuarios
7. 🔄 Revisión final y ajustes de diseño
