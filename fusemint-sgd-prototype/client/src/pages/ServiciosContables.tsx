import { useState } from 'react';
import { Link } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, ChevronRight, Building2, User, FileText } from 'lucide-react';

/**
 * Página Servicios Contables
 * Diseño: Institucionalismo Verde Moderno
 * - Tabs para tipos de cliente (Personas Jurídicas, Personas Naturales)
 * - Tarjetas de clientes con información de expedientes
 */

interface Cliente {
  id: string;
  nombre: string;
  tipo: 'juridica' | 'natural';
  identificacion: string;
  email: string;
  telefono: string;
  expedientes: number;
  estado: 'activo' | 'inactivo';
}

const clientesData: Cliente[] = [
  {
    id: '1',
    nombre: 'Corporación Ambiental Colombia S.A.S.',
    tipo: 'juridica',
    identificacion: '800.123.456-7',
    email: 'contacto@corpambiental.com',
    telefono: '+57 1 2345678',
    expedientes: 5,
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Consultoría Forestal Ltda.',
    tipo: 'juridica',
    identificacion: '860.987.654-3',
    email: 'info@consultaforestal.com',
    telefono: '+57 1 9876543',
    expedientes: 3,
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Juan Carlos Rodríguez Pérez',
    tipo: 'natural',
    identificacion: '1.234.567-8',
    email: 'jcrodriguez@email.com',
    telefono: '+57 300 1234567',
    expedientes: 2,
    estado: 'activo',
  },
  {
    id: '4',
    nombre: 'María Alejandra López García',
    tipo: 'natural',
    identificacion: '1.987.654-3',
    email: 'malopez@email.com',
    telefono: '+57 310 9876543',
    expedientes: 1,
    estado: 'activo',
  },
  {
    id: '5',
    nombre: 'Servicios Técnicos Ambientales E.U.',
    tipo: 'juridica',
    identificacion: '900.456.789-1',
    email: 'servicios@tecamb.com',
    telefono: '+57 1 4567890',
    expedientes: 4,
    estado: 'inactivo',
  },
];

export default function ServiciosContables() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  const filteredClientes = clientesData.filter((cliente) => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cliente.identificacion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'todos' || cliente.tipo === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Servicios Contables
            </h1>
            <p className="text-muted-foreground mt-1">
              Expedientes de clientes: personas jurídicas y personas naturales
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit">
            <Plus size={18} />
            Nuevo Cliente
          </Button>
        </div>

        {/* Buscador local */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Buscar por nombre o identificación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-secondary border-border focus:border-primary"
          />
        </div>

        {/* Tabs de tipos de cliente */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary border border-border">
            <TabsTrigger value="todos" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Todos ({clientesData.length})
            </TabsTrigger>
            <TabsTrigger value="juridica" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Juridicas ({clientesData.filter(c => c.tipo === 'juridica').length})
            </TabsTrigger>
            <TabsTrigger value="natural" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Naturales ({clientesData.filter(c => c.tipo === 'natural').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredClientes.length === 0 ? (
              <Card className="p-12 text-center border-border">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No se encontraron clientes</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredClientes.map((cliente) => (
                  <Link key={cliente.id} href={`/servicios-contables/${cliente.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border overflow-hidden">
                      {/* Encabezado con tipo de cliente */}
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {cliente.tipo === 'juridica' ? (
                              <Building2 size={20} />
                            ) : (
                              <User size={20} />
                            )}
                            <div>
                              <p className="text-xs font-medium opacity-90 uppercase">
                                {cliente.tipo === 'juridica' ? 'Persona Juridica' : 'Persona Natural'}
                              </p>
                              <p className="text-xs font-mono font-bold mt-0.5">{cliente.identificacion}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            cliente.estado === 'activo'
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-400/20 text-gray-100'
                          }`}>
                            {cliente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-4 space-y-4">
                        <div>
                          <h3 className="font-display font-bold text-foreground text-sm line-clamp-2">
                            {cliente.nombre}
                          </h3>
                        </div>

                        {/* Información de contacto */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Email</span>
                            <span className="text-muted-foreground text-xs truncate">{cliente.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Tel</span>
                            <span className="text-muted-foreground text-xs">{cliente.telefono}</span>
                          </div>
                        </div>

                        {/* Expedientes */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center gap-1">
                            <FileText size={16} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {cliente.expedientes} {cliente.expedientes === 1 ? 'expediente' : 'expedientes'}
                            </span>
                          </div>
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
