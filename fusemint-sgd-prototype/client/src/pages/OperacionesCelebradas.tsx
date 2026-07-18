import { useState } from 'react';
import { Link } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, ChevronRight, Calendar, Building2, FileText } from 'lucide-react';

/**
 * Página Operaciones Celebradas
 * Diseño: Institucionalismo Verde Moderno
 * - Tabs para tipos de operación (Proyectos, Convenios, Contratos)
 * - Tarjetas de expedientes con información resumen
 * - Buscador local
 */

interface Expediente {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'proyecto' | 'convenio' | 'contrato';
  entidad: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'finalizado' | 'en-revision';
}

const expedientesData: Expediente[] = [
  {
    id: '1',
    codigo: 'PROY-2024-001',
    nombre: 'Restauración Bosque Nativo Región Caribe',
    tipo: 'proyecto',
    entidad: 'Ministerio de Ambiente',
    fechaInicio: '2024-01-15',
    fechaFin: '2025-06-30',
    estado: 'activo',
  },
  {
    id: '2',
    codigo: 'PROY-2024-002',
    nombre: 'Educación Ambiental en Zonas Rurales',
    tipo: 'proyecto',
    entidad: 'Gobernación del Cauca',
    fechaInicio: '2024-03-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
  },
  {
    id: '3',
    codigo: 'CONV-2024-001',
    nombre: 'Convenio Cooperación Técnica ONG Internacional',
    tipo: 'convenio',
    entidad: 'The Nature Conservancy',
    fechaInicio: '2023-06-01',
    fechaFin: '2026-05-31',
    estado: 'activo',
  },
  {
    id: '4',
    codigo: 'CONT-2024-001',
    nombre: 'Contrato Servicios Consultoría Ambiental',
    tipo: 'contrato',
    entidad: 'Consultoría Ambiental S.A.S.',
    fechaInicio: '2024-02-01',
    fechaFin: '2024-08-31',
    estado: 'finalizado',
  },
];

export default function OperacionesCelebradas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  const filteredExpedientes = expedientesData.filter((exp) => {
    const matchesSearch = exp.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.codigo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'todos' || exp.tipo === activeTab;
    return matchesSearch && matchesTab;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'finalizado':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'en-revision':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'finalizado':
        return 'Finalizado';
      case 'en-revision':
        return 'En Revisión';
      default:
        return estado;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Operaciones Celebradas
            </h1>
            <p className="text-muted-foreground mt-1">
              Proyectos, convenios y contratos con documentos técnicos, financieros y legales
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit">
            <Plus size={18} />
            Nuevo Expediente
          </Button>
        </div>

        {/* Buscador local */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Buscar por código o nombre de expediente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-secondary border-border focus:border-primary"
          />
        </div>

        {/* Tabs de tipos de operación */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary border border-border">
            <TabsTrigger value="todos" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Todos ({expedientesData.length})
            </TabsTrigger>
            <TabsTrigger value="proyecto" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Proyectos ({expedientesData.filter(e => e.tipo === 'proyecto').length})
            </TabsTrigger>
            <TabsTrigger value="convenio" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Convenios ({expedientesData.filter(e => e.tipo === 'convenio').length})
            </TabsTrigger>
            <TabsTrigger value="contrato" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Contratos ({expedientesData.filter(e => e.tipo === 'contrato').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredExpedientes.length === 0 ? (
              <Card className="p-12 text-center border-border">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No se encontraron expedientes</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExpedientes.map((expediente) => (
                  <Link key={expediente.id} href={`/operaciones/${expediente.tipo}/${expediente.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border overflow-hidden">
                      {/* Encabezado con tipo de operación */}
                      <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium opacity-90 uppercase">
                              {expediente.tipo === 'proyecto' ? 'Proyecto' : expediente.tipo === 'convenio' ? 'Convenio' : 'Contrato'}
                            </p>
                            <p className="text-sm font-mono font-bold mt-1">{expediente.codigo}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getEstadoColor(expediente.estado)}`}>
                            {getEstadoLabel(expediente.estado)}
                          </span>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-4 space-y-4">
                        <div>
                          <h3 className="font-display font-bold text-foreground text-sm line-clamp-2">
                            {expediente.nombre}
                          </h3>
                        </div>

                        {/* Información */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Building2 size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground line-clamp-2">{expediente.entidad}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground text-xs">
                              {new Date(expediente.fechaInicio).toLocaleDateString('es-CO')} - {new Date(expediente.fechaFin).toLocaleDateString('es-CO')}
                            </span>
                          </div>
                        </div>

                        {/* Botón acceder */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-xs text-muted-foreground">3 carpetas</span>
                          <ChevronRight size={16} className="text-primary" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
