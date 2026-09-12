import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Add admin emails here. In production, use Firebase Custom Claims instead.
const ADMIN_EMAILS = ['admin@urbanwear.com', 'urbanwear.admin@gmail.com'];

export default function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return null;

  if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
