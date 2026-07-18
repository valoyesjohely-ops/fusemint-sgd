import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  logoUrl?: string;
}

export default function Header({ onMenuClick, logoUrl = '/manus-storage/fusemint-logo_ca73e5eb.png' }: HeaderProps) {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/buscador');
    }
  };

  // Datos simulados de usuario
  const user = {
    name: 'Juan Pérez',
    email: 'juan@fusemint.org',
    role: 'Administrador',
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Botón menú móvil + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-foreground hover:text-primary transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Logo pequeño en header */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src={logoUrl}
              alt="FUSEMINT"
              className="w-8 h-8"
            />
            <span className="font-display font-bold text-sm text-foreground hidden sm:inline">
              FUSEMINT
            </span>
          </Link>
        </div>

        {/* Buscador Global */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Buscar expedientes, documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="pl-10 pr-4 py-2 bg-secondary border-border focus:border-primary"
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg p-2 z-50">
                <div className="text-xs text-muted-foreground p-2">
                  Resultados para: <strong>{searchQuery}</strong>
                </div>
                {/* Aquí irían los resultados de búsqueda */}
              </div>
            )}
          </div>
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <button className="relative text-foreground hover:text-primary transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          {/* Menú usuario */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </button>

            {/* Dropdown menú usuario */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                    <User size={16} />
                    Mi Perfil
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary rounded-lg transition-colors">
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buscador móvil */}
      <div className="sm:hidden px-4 py-2 border-t border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 bg-secondary border-border"
          />
        </div>
      </div>
    </header>
  );
}
