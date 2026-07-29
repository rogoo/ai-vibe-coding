import { createContext, useContext } from 'react';

export interface AuthContextValue {
  /** Login of the signed-in user, or `null` when nobody is signed in. */
  user: string | null;
  signIn: (login: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }
  return context;
}
