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
  const isAuthenticated =
    process.env.NODE_ENV === 'production' ? true : process.env.NEXT_PUBLIC_AUTH_OVERRIDE !== 'false';
  return <AuthContext.Provider value={{ isAuthenticated }}>{props.children}</AuthContext.Provider>;
};
