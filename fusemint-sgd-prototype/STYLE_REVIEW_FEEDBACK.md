# Revisión de Estilo - FUSEMINT SGD Prototipo

## Retroalimentación de Revisión Independiente

### Fortalezas Actuales
- ✅ Estructura de aplicación clara: sidebar + búsqueda superior + contenido
- ✅ Navegación jerárquica coherente (módulos → expedientes → documentos)
- ✅ Tablas y tarjetas limpias y funcionales
- ✅ Etiquetas en español claras y operacionales
- ✅ Paleta verde institucional presente y reconocible
- ✅ Responsive design funcional

### Recomendaciones de Mejora

#### 1. **Consolidar Sistema de Colores**
**Problema**: Gradientes azules (Dashboard) y teales (Servicios Contables) diluyen la identidad FUSEMINT.

**Solución**:
- Usar verde institucional `#1B6D3B` como único color saturado para acciones primarias
- Mantener verde claro `#E8F5E9`, blanco y grises como sistema base
- Diferenciar módulos mediante:
  - Iconografía clara
  - Etiquetas descriptivas
  - Variaciones sutiles del verde (tonos más claros/oscuros)
  - Badges de estado

**Implementación**:
```css
/* Reemplazar gradientes de módulos */
.module-info { background: from-primary to-primary/80; } /* Verde únicamente */
.module-operaciones { background: from-primary to-primary/80; }
.module-servicios { background: from-primary to-primary/80; }
```

#### 2. **Fortalecer Identidad de Marca**
**Problema**: Logo "F" inconsistente y poco desarrollado; no refleja concepto de carpeta + hoja + jerarquía.

**Solución**:
- Crear lockup de logo único y consistente
- Usar en header y sidebar de forma uniforme
- Nunca como avatar de usuario (solo para marca)
- Considerar marca gráfica que combine:
  - Forma de carpeta
  - Elemento de hoja (sostenibilidad)
  - Líneas de jerarquía

#### 3. **Elevar Jerarquía Tipográfica**
**Problema**: Tipografía funcional pero genérica; no siente "diseñada".

**Solución**:
- Títulos de página: Poppins Bold 32px, más espaciado
- Subtítulos: Poppins SemiBold 18px con color primario
- Códigos de expediente: JetBrains Mono 14px, destacado visualmente
- Etiquetas: Inter Medium 12px con badges de color

**Implementación**:
```css
h1 { font-family: 'Poppins'; font-weight: 700; font-size: 32px; letter-spacing: -0.5px; }
.expediente-code { font-family: 'JetBrains Mono'; font-weight: 600; color: var(--primary); }
```

#### 4. **Agregar Motif Visual Institucional**
**Problema**: Tarjetas y tablas podrían pertenecer a cualquier CRM; falta identidad FUSEMINT.

**Solución**:
- Incorporar elementos visuales recurrentes:
  - Líneas de jerarquía sutiles en encabezados
  - Iconografía de carpetas/documentos consistente
  - Divisores con motif de hojas
  - Bordes izquierdos en tarjetas de expediente

**Ejemplos**:
- Encabezado de expediente: línea verde izquierda 4px
- Separadores de sección: patrón sutil de líneas
- Tarjetas de módulo: ícono de carpeta + hoja en esquina

#### 5. **Mejorar Contexto Visual de Navegación**
**Problema**: Usuarios pueden perder contexto de dónde están en la jerarquía.

**Solución**:
- Breadcrumbs consistentes en todas las páginas
- Indicador visual de sección activa en sidebar
- Encabezado contextual que muestre ruta completa
- Color de fondo sutil que cambie por módulo

**Implementación**:
```
Información General > Estatutos > Documento
[Encabezado verde institucional]
Gestionar documentos institucionales
```

#### 6. **Mejorar Voz de Marca en Textos**
**Problema**: Títulos genéricos ("Bienvenido al SGD") no reflejan propósito institucional.

**Solución**:
- Dashboard: "Gestionar expedientes documentales" en lugar de "Bienvenido al SGD"
- Operaciones: "Organizar proyectos, convenios y contratos"
- Información General: "Mantener documentos institucionales"
- Servicios: "Gestionar clientes y expedientes contables"

---

## Enmiendas Recomendadas a ideas.md

### Regla de Color
> `#1B6D3B` es el único color saturado de marca para acciones primarias, navegación activa y énfasis clave. Los gradientes azul/cian de módulos NO forman parte del sistema visual FUSEMINT.

### Regla de Marca
> FUSEMINT usa un único lockup de logo geométrico consistente que combina carpeta, hoja y líneas de jerarquía. Las marcas de letra por defecto aparecen solo como avatares de usuario, nunca como marca del producto.

### Regla de Voz
> Los títulos de página deben ser operacionales y enfocados en tareas, no genéricos. Usar frases institucionales directas como "Gestionar expedientes documentales" en lugar de "Bienvenido al SGD".

---

## Prioridad de Implementación

### Alta (Impacto Inmediato)
1. ✅ Reemplazar gradientes azul/teal con variaciones del verde
2. ✅ Mejorar títulos de página con voz operacional
3. ✅ Agregar líneas de jerarquía visual en tarjetas de expediente

### Media (Pulido Visual)
4. Fortalecer tipografía de códigos de expediente
5. Agregar motif de carpeta/hoja en elementos clave
6. Mejorar breadcrumbs en todas las páginas

### Baja (Refinamiento)
7. Crear lockup de logo más sofisticado
8. Agregar patrones sutiles de fondo
9. Optimizar espaciado y ritmo visual

---

## Notas de Implementación

- **No requiere cambio de estructura**: Las mejoras son principalmente de color, tipografía y motifs visuales
- **Mantener funcionalidad**: Todas las características actuales se preservan
- **Tiempo estimado**: 2-3 horas para implementar cambios de alta prioridad
- **Testing**: Verificar en móvil, tablet y desktop después de cambios

---

## Conclusión

El prototipo tiene una base sólida de funcionalidad y estructura. Las recomendaciones se enfocan en fortalecer la identidad visual de FUSEMINT y hacer que la interfaz se sienta menos como un template genérico y más como un sistema diseñado específicamente para gestión documental institucional colombiana.
