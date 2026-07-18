import React from 'react';
import { useLocation } from 'wouter';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Folder,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  requiredRoles?: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Expedientes',
    href: '/expedientes',
    icon: <Folder size={20} />,
  },
  {
    label: 'Documentos',
    href: '/documentos',
    icon: <FileText size={20} />,
  },
  {
    label: 'Operaciones Celebradas',
    href: '/operaciones',
    icon: <DollarSign size={20} />,
  },
  {
    label: 'Usuarios',
    href: '/usuarios',
    icon: <Users size={20} />,
    requiredRoles: ['admin'],
  },
  {
    label: 'Reportes',
    href: '/reportes',
    icon: <BarChart3 size={20} />,
  },
  {
    label: 'Configuración',
    href: '/configuracion',
    icon: <Settings size={20} />,
    requiredRoles: ['admin'],
  },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [pathname] = useLocation();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredRoles) return true;
    return item.requiredRoles.includes(user?.role || '');
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border transition-transform duration-300 lg:relative lg:top-0 z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">FUSEMINT</p>
                <p className="text-xs text-muted-foreground">SGD v1.0</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg transition-all group',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-secondary'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={isActive ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-destructive text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={18} />}
                </a>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
            >
              <LogOut size={18} className="mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
