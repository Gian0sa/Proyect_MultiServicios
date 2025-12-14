import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // No logeado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rol no permitido
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
