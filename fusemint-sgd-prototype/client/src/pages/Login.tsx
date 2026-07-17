import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Página de Login
 * Diseño: Institucionalismo Verde Moderno
 * - Fondo limpio con patrón sutil
 * - Tarjeta centrada con formulario
 * - Verde institucional como color primario
 */

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-foreground via-background to-secondary flex items-center justify-center px-4 py-12">
      {/* Contenedor principal */}
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-display font-bold text-2xl">F</span>
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            FUSEMINT
          </h1>
          <p className="text-muted-foreground text-sm">
            Sistema de Gestión Documental
          </p>
        </div>

        {/* Tarjeta de login */}
        <Card className="shadow-lg border-border">
          <div className="p-8">
            <h2 className="text-xl font-display font-bold text-foreground mb-6">
              Iniciar Sesión
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@fusemint.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-border focus:border-primary focus:ring-primary"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-border focus:border-primary focus:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Recordar y olvidé contraseña */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className="text-muted-foreground">Recordarme</span>
                </label>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition-colors"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-muted-foreground">O</span>
              </div>
            </div>

            {/* Botón demo */}
            <Button
              type="button"
              onClick={() => {
                setEmail('demo@fusemint.org');
                setPassword('demo123');
              }}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary"
            >
              Usar Credenciales Demo
            </Button>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-border bg-secondary/50 text-center text-xs text-muted-foreground">
            <p>
              Sistema de Gestión Documental FUSEMINT v1.0.0
            </p>
          </div>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Para acceder, utiliza tus credenciales institucionales de FUSEMINT
          </p>
        </div>
      </div>
    </div>
  );
}
