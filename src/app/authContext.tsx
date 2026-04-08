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
  // TODO: Remove or change when authentication is more complete
  // Currently always setting the value to true when the app is running on NAIS, if not one can toggle it by using NEXT_PUBLIC_AUTH_OVERRIDE
  // NEXT_PUBLIC_AUTH_OVERRIDE is currently used in the auth playwright tests to enure that we can test the fields that will not be visible to external users.
  const isAuthenticated =
    process.env.NODE_ENV === 'production' ? true : process.env.NEXT_PUBLIC_AUTH_OVERRIDE !== 'false';
  return <AuthContext.Provider value={{ isAuthenticated }}>{props.children}</AuthContext.Provider>;
};
