import { createContext, useContext } from 'react';

export interface User {
  email: string;
}

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
