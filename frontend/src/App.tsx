import { Router, Route } from 'wouter';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Expedientes from '@/pages/Expedientes';
import Documentos from '@/pages/Documentos';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/expedientes" component={Expedientes} />
        <ProtectedRoute path="/documentos" component={Documentos} />
        <Route path="/" component={() => <Dashboard />} />
      </Router>
    </AuthProvider>
  );
}
