import { createContext, useContext } from 'react';
import type { User, UserFilter, UserInput } from '../types/user';

export interface UserContextValue {
  users: User[];
  loading: boolean;
  searchUsers: (filter?: UserFilter) => Promise<void>;
  addUser: (data: UserInput) => Promise<boolean>;
  updateUser: (id: number, data: UserInput) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useUsers(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used inside a UserProvider.');
  }
  return context;
}
