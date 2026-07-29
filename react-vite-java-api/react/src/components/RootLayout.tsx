import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from '../provider/AuthProvider';
import Header from './Header';

/** Shell shared by every route: auth state, toasts and the header. */
export function RootLayout() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors closeButton />
      <Header />
      <Outlet />
    </AuthProvider>
  );
}

export default RootLayout;
