import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, token } = useAuthStore();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
