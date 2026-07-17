import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Download, MoreVertical } from 'lucide-react';

/**
 * Página Información General\n * Diseño: Institucionalismo Verde Moderno\n * - Documentos institucionales permanentes\n * - Organización por categorías\n */

interface Documento {
  id: string;
  nombre: string;
  categoria: string;
  fechaCargue: string;
  usuario: string;
}

const documentosData: Documento[] = [
  {
    id: '1',
    nombre: 'Estatutos de FUSEMINT',
    categoria: 'estatutos',
    fechaCargue: '2023-01-15',
    usuario: 'Administrador',
  },
  {
    id: '2',
    nombre: 'Certificado Cámara de Comercio 2024',
    categoria: 'camara-comercio',
    fechaCargue: '2024-01-10',
    usuario: 'Contabilidad',
  },
  {
    id: '3',
    nombre: 'RUT - Registro Único Tributario',
    categoria: 'rut',
    fechaCargue: '2023-06-20',
    usuario: 'Administrador',
  },
  {
    id: '4',
    nombre: 'Organigrama Institucional 2024',
    categoria: 'organigrama',
    fechaCargue: '2024-01-05',
    usuario: 'Recursos Humanos',
  },
  {
    id: '5',
    nombre: 'Manual de Procedimientos',
    categoria: 'manuales',
    fechaCargue: '2023-09-12',
    usuario: 'Administrador',
  },
  {
    id: '6',
    nombre: 'Política de Gestión Documental',
    categoria: 'politicas',
    fechaCargue: '2024-02-01',
    usuario: 'Administrador',
  },
];

const categorias = [
  { id: 'todos', label: 'Todos', icon: '📄' },
  { id: 'estatutos', label: 'Estatutos', icon: '📋' },
  { id: 'camara-comercio', label: 'Cámara de Comercio', icon: '🏢' },
  { id: 'rut', label: 'RUT', icon: '🔢' },
  { id: 'organigrama', label: 'Organigrama', icon: '👥' },
  { id: 'manuales', label: 'Manuales', icon: '📚' },
  { id: 'politicas', label: 'Políticas', icon: '⚖️' },
];

export default function InformacionGeneral() {
  const [activeCategory, setActiveCategory] = useState('todos');

  const filteredDocumentos = activeCategory === 'todos'
    ? documentosData
    : documentosData.filter(doc => doc.categoria === activeCategory);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Información General
            </h1>
            <p className="text-muted-foreground mt-1">
              Documentos institucionales permanentes de FUSEMINT
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit">
            <Plus size={18} />
            Cargar Documento
          </Button>
        </div>

        {/* Tabs de categorías */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 bg-secondary border border-border overflow-x-auto">
            {categorias.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">{cat.icon}</span>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            {filteredDocumentos.length === 0 ? (
              <Card className="p-12 text-center border-border">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No hay documentos en esta categoría</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Grid de tarjetas para móvil/tablet */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                  {filteredDocumentos.map((doc) => (
                    <Card key={doc.id} className="p-4 border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText size={20} className="text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground text-sm line-clamp-2">
                              {doc.nombre}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(doc.fechaCargue).toLocaleDateString('es-CO')}
                            </p>
                          </div>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">{doc.usuario}</span>
                        <button className="text-primary hover:text-primary/80 transition-colors">
                          <Download size={16} />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Tabla para desktop */}
                <Card className="border-border overflow-hidden hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary border-b border-border">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                            Nombre del Documento
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                            Fecha de Cargue
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                            Usuario
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredDocumentos.map((doc) => (
                          <tr key={doc.id} className="hover:bg-secondary transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                <span className="text-sm font-medium text-foreground">{doc.nombre}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-muted-foreground">
                                {new Date(doc.fechaCargue).toLocaleDateString('es-CO')}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-muted-foreground">{doc.usuario}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="text-primary hover:text-primary/80 transition-colors">
                                  <Download size={16} />
                                </button>
                                <button className="text-muted-foreground hover:text-foreground transition-colors">
                                  <MoreVertical size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
