import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../provider/AuthContext';

/** Pathless layout route: sends anonymous visitors back to the login page. */
export function RequireAuth() {
  const { user } = useAuth();

  return user === null ? <Navigate to="/" replace /> : <Outlet />;
}

export default RequireAuth;
