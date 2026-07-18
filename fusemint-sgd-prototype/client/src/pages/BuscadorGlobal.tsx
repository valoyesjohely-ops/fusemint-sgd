import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AdvancedFilters from '@/components/AdvancedFilters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sliders, FileText, Briefcase, Building2 } from 'lucide-react';

/**
 * Página Buscador Global
 * Diseño: Institucionalismo Verde Moderno
 * - Buscador prominente
 * - Panel de filtros avanzados
 * - Resultados por categoría
 */

interface ResultadoBusqueda {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'documento' | 'expediente' | 'cliente';
  categoria: string;
  fecha: string;
}

const resultadosSimulados: ResultadoBusqueda[] = [
  {
    id: '1',
    titulo: 'Estudio de Línea Base Ambiental',
    descripcion: 'Proyecto: Restauración Bosque Nativo Región Caribe',
    tipo: 'documento',
    categoria: 'Técnica',
    fecha: '2024-01-20',
  },
  {
    id: '2',
    titulo: 'Restauración Bosque Nativo Región Caribe',
    descripcion: 'Proyecto activo - Ministerio de Ambiente',
    tipo: 'expediente',
    categoria: 'Proyectos',
    fecha: '2024-01-15',
  },
  {
    id: '3',
    titulo: 'Presupuesto Anual 2024',
    descripcion: 'Proyecto: Restauración Bosque Nativo Región Caribe',
    tipo: 'documento',
    categoria: 'Financiera',
    fecha: '2024-01-10',
  },
  {
    id: '4',
    titulo: 'Corporación Ambiental Colombia S.A.S.',
    descripcion: 'Persona Jurídica - 5 expedientes',
    tipo: 'cliente',
    categoria: 'Servicios Contables',
    fecha: '2024-01-05',
  },
  {
    id: '5',
    titulo: 'Contrato Principal',
    descripcion: 'Proyecto: Restauración Bosque Nativo Región Caribe',
    tipo: 'documento',
    categoria: 'Legal',
    fecha: '2024-01-05',
  },
];

export default function BuscadorGlobal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>(resultadosSimulados);
  const [activeTab, setActiveTab] = useState('todos');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Simulación de búsqueda
    if (query.trim()) {
      const filtered = resultadosSimulados.filter(r =>
        r.titulo.toLowerCase().includes(query.toLowerCase()) ||
        r.descripcion.toLowerCase().includes(query.toLowerCase())
      );
      setResultados(filtered);
    } else {
      setResultados(resultadosSimulados);
    }
  };

  const handleApplyFilters = (filters: any) => {
    // Aquí se aplicarían los filtros
    console.log('Filtros aplicados:', filters);
    setFiltersOpen(false);
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'documento':
        return <FileText size={18} className="text-blue-500" />;
      case 'expediente':
        return <Briefcase size={18} className="text-primary" />;
      case 'cliente':
        return <Building2 size={18} className="text-emerald-500" />;
      default:
        return null;
    }
  };

  const getEtiquetaTipo = (tipo: string) => {
    switch (tipo) {
      case 'documento':
        return 'Documento';
      case 'expediente':
        return 'Expediente';
      case 'cliente':
        return 'Cliente';
      default:
        return tipo;
    }
  };

  const filteredResultados = activeTab === 'todos'
    ? resultados
    : resultados.filter(r => r.tipo === activeTab);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Encabezado */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Buscador Global
          </h1>
          <p className="text-muted-foreground mt-1">
            Encuentra expedientes, documentos y clientes rápidamente
          </p>
        </div>

        {/* Buscador principal */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Buscar expedientes, documentos, clientes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-12 py-3 text-lg bg-secondary border-border focus:border-primary"
            />
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sliders size={20} />
            </button>
          </div>

          {/* Sugerencias rápidas */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Búsquedas recientes:</span>
            <button className="px-3 py-1 rounded-full bg-secondary text-xs text-foreground hover:bg-primary hover:text-white transition-colors">
              Proyectos 2024
            </button>
            <button className="px-3 py-1 rounded-full bg-secondary text-xs text-foreground hover:bg-primary hover:text-white transition-colors">
              Documentos financieros
            </button>
            <button className="px-3 py-1 rounded-full bg-secondary text-xs text-foreground hover:bg-primary hover:text-white transition-colors">
              Contratos activos
            </button>
          </div>
        </div>

        {/* Panel de filtros */}
        <AdvancedFilters
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          onApply={handleApplyFilters}
        />

        {/* Resultados */}
        {searchQuery.trim() && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Se encontraron <strong>{filteredResultados.length}</strong> resultados para "<strong>{searchQuery}</strong>"
              </p>
            </div>

            {/* Tabs de tipos */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-secondary border border-border">
                <TabsTrigger value="todos" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Todos ({resultados.length})
                </TabsTrigger>
                <TabsTrigger value="documento" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Documentos ({resultados.filter(r => r.tipo === 'documento').length})
                </TabsTrigger>
                <TabsTrigger value="expediente" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Expedientes ({resultados.filter(r => r.tipo === 'expediente').length})
                </TabsTrigger>
                <TabsTrigger value="cliente" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Clientes ({resultados.filter(r => r.tipo === 'cliente').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredResultados.length === 0 ? (
                  <Card className="p-12 text-center border-border">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No se encontraron resultados</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filteredResultados.map((resultado) => (
                      <Card
                        key={resultado.id}
                        className="p-4 border-border hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getIconoTipo(resultado.tipo)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-medium text-foreground line-clamp-1">
                                {resultado.titulo}
                              </h3>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">
                                {getEtiquetaTipo(resultado.tipo)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                              {resultado.descripcion}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="px-2 py-1 bg-secondary rounded">
                                  {resultado.categoria}
                                </span>
                                <span>
                                  {new Date(resultado.fecha).toLocaleDateString('es-CO')}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-foreground hover:bg-secondary"
                              >
                                Ver
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Estado inicial sin búsqueda */}
        {!searchQuery.trim() && (
          <Card className="p-12 text-center border-border">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Comienza a escribir para buscar expedientes, documentos y clientes
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
