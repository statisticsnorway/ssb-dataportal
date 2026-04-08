'use client';

import { createContext, ReactNode, useContext } from 'react';
import { authenticateUser } from '@/libs/auth/userAuth';
import { Auth } from '@/types/auth';

const AuthContext = createContext<Auth | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = (props: AuthProviderProps) => {
  return <AuthContext.Provider value={authenticateUser()}>{props.children}</AuthContext.Provider>;
};
