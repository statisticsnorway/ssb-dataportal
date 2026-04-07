'use client';

import { createContext, ReactNode, useContext } from 'react';

interface Auth {
  isAuthenticated: boolean;
}

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
  return <AuthContext.Provider value={{ isAuthenticated: true }}>{props.children}</AuthContext.Provider>;
};
