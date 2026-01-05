import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { LoadingOverlay } from '@/components/ui';
import type { PlanType } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: PlanType | PlanType[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredPlan,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Carregando estado de autenticação
  if (loading) {
    return <LoadingOverlay message="Verificando autenticação..." />;
  }

  // Não autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verificar plano se necessário
  if (requiredPlan && user?.plan) {
    const allowedPlans = Array.isArray(requiredPlan) ? requiredPlan : [requiredPlan];
    
    if (!allowedPlans.includes(user.plan.type)) {
      return <Navigate to="/plans" state={{ from: location, requiredPlan }} replace />;
    }
  }

  // Se requer plano mas usuário não tem nenhum
  if (requiredPlan && !user?.plan) {
    return <Navigate to="/plans" state={{ from: location, requiredPlan }} replace />;
  }

  return <>{children}</>;
}
