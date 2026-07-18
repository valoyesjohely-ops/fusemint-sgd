import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Eye, Trash2, Plus, Search } from 'lucide-react';
import { expedientesAPI } from '@/services/api';
import DocumentViewer from '@/components/DocumentViewer';

interface Expediente {
  id: string;
  numero: string;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
  documentos?: Documento[];
}

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  tamaño: number;
  fechaCarga: string;
  url: string;
}

export default function Expedientes() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    const loadExpedientes = async () => {
      try {
        const data = await expedientesAPI.list();
        setExpedientes(data);
      } catch (error) {
        console.error('Error loading expedientes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExpedientes();
  }, []);

  const filteredExpedientes = expedientes.filter((exp) =>
    exp.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDocument = (doc: Documento) => {
    setSelectedDocumento(doc);
    setShowViewer(true);
  };

  const handleDownloadDocument = (doc: Documento) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.nombre;
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Expedientes</h1>
            <p className="text-muted-foreground">Gestiona todos tus expedientes documentales</p>
          </div>
          <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90">
            <Plus size={18} className="mr-2" />
            Nuevo Expediente
          </Button>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por número o título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabla de Expedientes */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Expedientes</CardTitle>
            <CardDescription>{filteredExpedientes.length} expedientes encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando expedientes...</p>
              </div>
            ) : filteredExpedientes.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No hay expedientes disponibles</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Número</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Título</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Documentos</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Fecha</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpedientes.map((expediente) => (
                      <React.Fragment key={expediente.id}>
                        <tr className="border-b border-border hover:bg-secondary/50 transition">
                          <td className="py-3 px-4">
                            <span className="font-medium text-primary">{expediente.numero}</span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-foreground">{expediente.titulo}</p>
                            <p className="text-xs text-muted-foreground">{expediente.descripcion}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                expediente.estado === 'activo'
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-yellow-50 text-yellow-700'
                              }`}
                            >
                              {expediente.estado}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm">{expediente.documentos?.length || 0}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(expediente.fechaCreacion).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              Ver Detalles
                            </Button>
                          </td>
                        </tr>

                        {/* Documentos del Expediente */}
                        {expediente.documentos && expediente.documentos.length > 0 && (
                          <tr className="bg-secondary/30">
                            <td colSpan={6} className="py-4 px-4">
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Documentos:</p>
                                {expediente.documentos.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-border"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <FileText size={16} className="text-primary flex-shrink-0" />
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground truncate">
                                          {doc.nombre}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {(doc.tamaño / 1024).toFixed(2)} KB • {new Date(doc.fechaCarga).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewDocument(doc)}
                                        title="Ver documento"
                                      >
                                        <Eye size={16} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownloadDocument(doc)}
                                        title="Descargar documento"
                                      >
                                        <Download size={16} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Viewer Modal */}
        {showViewer && selectedDocumento && (
          <DocumentViewer
            documento={selectedDocumento}
            onClose={() => setShowViewer(false)}
            onDownload={() => handleDownloadDocument(selectedDocumento)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
