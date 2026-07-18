import { Link } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Briefcase, DollarSign, Plus, TrendingUp, Users, Clock } from 'lucide-react';

/**
 * Página Dashboard
 * Diseño: Institucionalismo Verde Moderno
 * - Tarjetas de módulos principales
 * - Estadísticas rápidas
 * - Acciones frecuentes
 */

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface ModuleCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  count?: number;
}

export default function Dashboard() {
  // Estadísticas simuladas
  const stats: StatCard[] = [
    {
      label: 'Total Expedientes',
      value: '248',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Documentos',
      value: '1,543',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Usuarios Activos',
      value: '12',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Actualizaciones Hoy',
      value: '34',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  // Módulos principales
  const modules: ModuleCard[] = [
    {
      title: 'Información General',
      description: 'Documentos institucionales permanentes de la fundación',
      icon: <FileText className="w-8 h-8" />,
      href: '/informacion-general',
      color: 'from-primary to-primary/80',
      count: 45,
    },
    {
      title: 'Operaciones Celebradas',
      description: 'Proyectos, convenios y contratos con sus documentos técnicos, financieros y legales',
      icon: <Briefcase className="w-8 h-8" />,
      href: '/operaciones',
      color: 'from-primary to-primary/80',
      count: 248,
    },
    {
      title: 'Servicios Contables',
      description: 'Expedientes de clientes: personas jurídicas y personas naturales',
      icon: <DollarSign className="w-8 h-8" />,
      href: '/servicios-contables',
      color: 'from-primary/90 to-primary/70',
      count: 156,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-8">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Gestionar Expedientes Documentales
            </h1>
            <p className="text-muted-foreground mt-1">
              Acceso centralizado a proyectos, convenios, contratos y documentos institucionales
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 w-fit">
            <Plus size={18} />
            Nuevo Expediente
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Módulos principales */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Módulos Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((module, idx) => (
              <Link key={idx} href={module.href}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-border">
                  {/* Encabezado con gradiente */}
                  <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                    <div className="flex items-start justify-between">
                      <div>{module.icon}</div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{module.count}</p>
                        <p className="text-xs opacity-90">expedientes</p>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h3 className="text-lg font-display font-bold text-foreground mb-2">
                      {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {module.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-border text-foreground hover:bg-secondary"
                    >
                      Acceder
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Actividad reciente */}
        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Actividad Reciente
          </h2>
          <Card className="border-border overflow-hidden">
            <div className="divide-y divide-border">
              {[
                { action: 'Documento cargado', item: 'Contrato Proyecto Ambiental 2024', time: 'hace 2 horas', user: 'Juan Pérez' },
                { action: 'Expediente creado', item: 'Convenio con ONG Internacional', time: 'hace 5 horas', user: 'María García' },
                { action: 'Documento actualizado', item: 'Informe Financiero Q2 2024', time: 'hace 1 día', user: 'Carlos López' },
                { action: 'Expediente archivado', item: 'Proyecto Finalizado 2023', time: 'hace 2 días', user: 'Ana Martínez' },
              ].map((activity, idx) => (
                <div key={idx} className="p-4 hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <p className="text-xs font-medium text-foreground mt-1">{activity.user}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
