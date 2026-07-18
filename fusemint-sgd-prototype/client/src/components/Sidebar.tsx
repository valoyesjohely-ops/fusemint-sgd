import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, Menu, X, FileText, Briefcase, DollarSign, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('operaciones');

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      id: 'informacion',
      label: 'Información General',
      icon: FileText,
      href: '/informacion-general',
      submenu: null,
    },
    {
      id: 'operaciones',
      label: 'Operaciones Celebradas',
      icon: Briefcase,
      href: '/operaciones',
      submenu: [
        { label: 'Proyectos', href: '/operaciones/proyectos' },
        { label: 'Convenios', href: '/operaciones/convenios' },
        { label: 'Contratos', href: '/operaciones/contratos' },
      ],
    },
    {
      id: 'servicios',
      label: 'Servicios Contables',
      icon: DollarSign,
      href: '/servicios-contables',
      submenu: [
        { label: 'Personas Jurídicas', href: '/servicios-contables/personas-juridicas' },
        { label: 'Personas Naturales', href: '/servicios-contables/personas-naturales' },
      ],
    },
    {
      id: 'admin',
      label: 'Administración',
      icon: Settings,
      href: '/admin',
      submenu: [
        { label: 'Usuarios', href: '/admin/usuarios' },
        { label: 'Configuración', href: '/admin/configuracion' },
      ],
    },
  ];

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-40',
          'lg:relative lg:translate-x-0 lg:z-0',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-display font-bold text-sm text-sidebar-foreground hidden sm:inline">
              FUSEMINT
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenu === item.id;
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <li key={item.id}>
                  {/* Item principal */}
                  <div
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      expandedMenu === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
                    )}
                    onClick={() => hasSubmenu && toggleMenu(item.id)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 flex-1"
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                    {hasSubmenu && (
                      <ChevronDown
                        size={16}
                        className={cn(
                          'transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </div>

                  {/* Submenu */}
                  {hasSubmenu && isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                      {item.submenu.map((subitem, idx) => (
                        <li key={idx}>
                          <Link
                            href={subitem.href}
                            className={cn(
                              'block px-3 py-2 rounded-lg text-sm transition-colors',
                              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                          >
                            {subitem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        <div className="border-t border-sidebar-border p-4">
          <div className="text-xs text-sidebar-foreground/60">
            <p>FUSEMINT SGD</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
