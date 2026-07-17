import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Componente Panel de Filtros Avanzados
 * Diseño: Institucionalismo Verde Moderno
 * - Panel colapsable en sidebar derecho
 * - Múltiples criterios de filtrado
 * - Botones de aplicar y limpiar filtros
 */

interface FilterState {
  grupoDocumental: string;
  tipoOperacion: string;
  expediente: string;
  tipoDocumental: string;
  seccion: string;
  entidad: string;
  fechaInicio: string;
  fechaFin: string;
}

interface AdvancedFiltersProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApply?: (filters: FilterState) => void;
  onClear?: () => void;
}

export default function AdvancedFilters({
  isOpen = false,
  onClose,
  onApply,
  onClear,
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    grupoDocumental: '',
    tipoOperacion: '',
    expediente: '',
    tipoDocumental: '',
    seccion: '',
    entidad: '',
    fechaInicio: '',
    fechaFin: '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply?.(filters);
  };

  const handleClear = () => {
    setFilters({
      grupoDocumental: '',
      tipoOperacion: '',
      expediente: '',
      tipoDocumental: '',
      seccion: '',
      entidad: '',
      fechaInicio: '',
      fechaFin: '',
    });
    onClear?.();
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel de filtros */}
      <aside
        className={cn(
          'fixed right-0 top-0 h-screen w-80 bg-white border-l border-border shadow-lg transition-transform duration-300 z-40',
          'lg:relative lg:translate-x-0 lg:z-0',
          !isOpen && 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary" />
            <h2 className="font-display font-bold text-foreground">Filtros Avanzados</h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Grupo Documental */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Grupo Documental</label>
            <select
              value={filters.grupoDocumental}
              onChange={(e) => handleFilterChange('grupoDocumental', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Todos</option>
              <option value="informacion">Información General</option>
              <option value="operaciones">Operaciones Celebradas</option>
              <option value="servicios">Servicios Contables</option>
            </select>
          </div>

          {/* Tipo de Operación */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo de Operación</label>
            <select
              value={filters.tipoOperacion}
              onChange={(e) => handleFilterChange('tipoOperacion', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Todos</option>
              <option value="proyecto">Proyecto</option>
              <option value="convenio">Convenio</option>
              <option value="contrato">Contrato</option>
            </select>
          </div>

          {/* Expediente */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Expediente</label>
            <Input
              type="text"
              placeholder="Buscar expediente..."
              value={filters.expediente}
              onChange={(e) => handleFilterChange('expediente', e.target.value)}
              className="border-border focus:border-primary"
            />
          </div>

          {/* Tipo Documental */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo Documental</label>
            <select
              value={filters.tipoDocumental}
              onChange={(e) => handleFilterChange('tipoDocumental', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Todos</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="xlsx">XLSX</option>
              <option value="imagen">Imagen</option>
            </select>
          </div>

          {/* Sección */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sección</label>
            <select
              value={filters.seccion}
              onChange={(e) => handleFilterChange('seccion', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Todas</option>
              <option value="tecnica">Técnica</option>
              <option value="financiera">Financiera</option>
              <option value="legal">Legal</option>
            </select>
          </div>

          {/* Entidad o Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Entidad o Cliente</label>
            <Input
              type="text"
              placeholder="Buscar entidad..."
              value={filters.entidad}
              onChange={(e) => handleFilterChange('entidad', e.target.value)}
              className="border-border focus:border-primary"
            />
          </div>

          {/* Rango de Fechas */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Fecha de Cargue</label>
            <div className="space-y-2">
              <Input
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                className="border-border focus:border-primary"
              />
              <Input
                type="date"
                value={filters.fechaFin}
                onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                className="border-border focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="border-t border-border p-4 space-y-2 bg-secondary">
          <Button
            onClick={handleApply}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Aplicar Filtros
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full border-border text-foreground hover:bg-background"
            disabled={!hasActiveFilters}
          >
            <RotateCcw size={16} className="mr-2" />
            Limpiar
          </Button>
        </div>
      </aside>
    </>
  );
}
