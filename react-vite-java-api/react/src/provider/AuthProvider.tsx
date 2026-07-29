import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { AuthContext, type AuthContextValue } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const signIn = useCallback((login: string) => {
    setUser(login);
    toast.success(`Welcome, ${login}!`);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    toast.info('You have been signed out.');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
