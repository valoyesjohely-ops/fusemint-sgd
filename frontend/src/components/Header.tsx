import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, LogOut, Bell, Search, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/expedientes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-primary">FUSEMINT SGD</h1>
          </div>
        </div>

        {/* Center - Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar expedientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>

          {/* User Menu */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-foreground">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
