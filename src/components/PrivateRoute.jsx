import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redireciona para o dashboard correto baseado na role do usuário
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'cidadao') return <Navigate to="/dashboard/cidadao" replace />;
    if (user.role === 'orgao') return <Navigate to="/dashboard/orgao" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
