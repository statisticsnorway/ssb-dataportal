'use client';

import { createContext, ReactNode, useContext } from 'react';
import { Auth } from '@/types/auth';

const AuthContext = createContext<Auth | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps extends Auth {
  children: ReactNode;
}

export const AuthProvider = ({ children, ...auth }: AuthProviderProps) => {
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
