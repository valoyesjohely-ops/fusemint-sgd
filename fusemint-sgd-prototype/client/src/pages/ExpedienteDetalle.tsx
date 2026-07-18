import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Plus, FileText, Folder, Download, Share2, MoreVertical } from 'lucide-react';

/**
 * Página Detalle de Expediente
 * Diseño: Institucionalismo Verde Moderno
 * - Vista resumen del expediente
 * - Tres carpetas principales (Técnica, Financiera, Legal)
 * - Listado de documentos dentro de cada carpeta
 */

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  fechaCargue: string;
  tamaño: string;
  usuario: string;
}

interface Carpeta {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
  color: string;
  documentos: Documento[];
}

const expedienteData = {
  codigo: 'PROY-2024-001',
  nombre: 'Restauración Bosque Nativo Región Caribe',
  tipo: 'Proyecto',
  entidad: 'Ministerio de Ambiente',
  fechaInicio: '2024-01-15',
  fechaFin: '2025-06-30',
  estado: 'activo',
  descripcion: 'Proyecto de restauración de ecosistemas boscosos en la región caribe colombiana con enfoque en biodiversidad y cambio climático.',
};

const carpetasData: Carpeta[] = [
  {
    id: 'tecnica',
    nombre: 'Técnica',
    descripcion: 'Documentos técnicos, estudios, análisis y reportes',
    icon: '📋',
    color: 'from-blue-500 to-blue-600',
    documentos: [
      {
        id: '1',
        nombre: 'Estudio de Línea Base Ambiental',
        tipo: 'PDF',
        fechaCargue: '2024-01-20',
        tamaño: '4.2 MB',
        usuario: 'Juan Pérez',
      },
      {
        id: '2',
        nombre: 'Plan de Manejo Forestal',
        tipo: 'DOCX',
        fechaCargue: '2024-02-10',
        tamaño: '2.8 MB',
        usuario: 'María García',
      },
      {
        id: '3',
        nombre: 'Informe Técnico Q1 2024',
        tipo: 'PDF',
        fechaCargue: '2024-04-15',
        tamaño: '3.1 MB',
        usuario: 'Carlos López',
      },
    ],
  },
  {
    id: 'financiera',
    nombre: 'Financiera',
    descripcion: 'Presupuestos, facturas, reportes financieros y auditorías',
    icon: '💰',
    color: 'from-green-500 to-green-600',
    documentos: [
      {
        id: '4',
        nombre: 'Presupuesto Anual 2024',
        tipo: 'XLSX',
        fechaCargue: '2024-01-10',
        tamaño: '1.5 MB',
        usuario: 'Ana Martínez',
      },
      {
        id: '5',
        nombre: 'Informe Financiero Q1 2024',
        tipo: 'PDF',
        fechaCargue: '2024-04-30',
        tamaño: '2.2 MB',
        usuario: 'Roberto Díaz',
      },
    ],
  },
  {
    id: 'legal',
    nombre: 'Legal',
    descripcion: 'Contratos, acuerdos, permisos y documentación legal',
    icon: '⚖️',
    color: 'from-purple-500 to-purple-600',
    documentos: [
      {
        id: '6',
        nombre: 'Contrato Principal',
        tipo: 'PDF',
        fechaCargue: '2024-01-05',
        tamaño: '1.8 MB',
        usuario: 'Juan Pérez',
      },
      {
        id: '7',
        nombre: 'Acta de Constitución',
        tipo: 'PDF',
        fechaCargue: '2024-01-08',
        tamaño: '0.9 MB',
        usuario: 'María García',
      },
      {
        id: '8',
        nombre: 'Permisos Ambientales',
        tipo: 'PDF',
        fechaCargue: '2024-01-12',
        tamaño: '3.5 MB',
        usuario: 'Carlos López',
      },
    ],
  },
];

export default function ExpedienteDetalle() {
  const [, navigate] = useLocation();
  const [activeCarpeta, setActiveCarpeta] = useState('tecnica');

  const activeCarpetaData = carpetasData.find(c => c.id === activeCarpeta);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/operaciones')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
        >
          <ChevronLeft size={16} />
          Volver a Operaciones
        </button>

        {/* Encabezado con información resumen */}
        <Card className="border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium opacity-90 uppercase">Proyecto</p>
                <h1 className="text-2xl font-display font-bold mt-2">{expedienteData.nombre}</h1>
                <p className="text-sm opacity-90 mt-2">{expedienteData.descripcion}</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-medium uppercase">
                {expedienteData.estado}
              </span>
            </div>
          </div>

          {/* Información resumen */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Código</p>
              <p className="text-sm font-mono font-bold text-foreground mt-1">{expedienteData.codigo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Entidad</p>
              <p className="text-sm font-medium text-foreground mt-1">{expedienteData.entidad}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Inicio</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {new Date(expedienteData.fechaInicio).toLocaleDateString('es-CO')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Fin</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {new Date(expedienteData.fechaFin).toLocaleDateString('es-CO')}
              </p>
            </div>
          </div>
        </Card>

        {/* Acciones */}
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
            <Plus size={18} />
            Cargar Documento
          </Button>
          <Button variant="outline" className="border-border gap-2">
            <Download size={18} />
            Descargar Todo
          </Button>
          <Button variant="outline" className="border-border gap-2">
            <Share2 size={18} />
            Compartir
          </Button>
        </div>

        {/* Tabs de carpetas */}
        <Tabs value={activeCarpeta} onValueChange={setActiveCarpeta} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary border border-border">
            {carpetasData.map((carpeta) => (
              <TabsTrigger
                key={carpeta.id}
                value={carpeta.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {carpeta.icon} {carpeta.nombre}
              </TabsTrigger>
            ))}
          </TabsList>

          {carpetasData.map((carpeta) => (
            <TabsContent key={carpeta.id} value={carpeta.id} className="mt-6">
              <div className="space-y-4">
                {/* Descripción de carpeta */}
                <div className="text-sm text-muted-foreground">
                  {carpeta.descripcion}
                </div>

                {/* Tabla de documentos */}
                <Card className="border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary border-b border-border">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                            Nombre
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                            Tipo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                            Tamaño
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
                        {carpeta.documentos.map((doc) => (
                          <tr key={doc.id} className="hover:bg-secondary transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{doc.nombre}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-mono text-muted-foreground">{doc.tipo}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-muted-foreground">{doc.tamaño}</span>
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
                              <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
