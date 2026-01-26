'use client';

import React, { createContext, useContext } from 'react';
import type { PublicRuntimeConfig } from './serverEnv';

type ReadonlyRuntimeConfig = Readonly<PublicRuntimeConfig>;

const RuntimeConfigContext = createContext<ReadonlyRuntimeConfig | undefined>(undefined);

type ProviderProps = Readonly<{
  value: ReadonlyRuntimeConfig;
  children: React.ReactNode;
}>;

export function RuntimeConfigProvider({ value, children }: ProviderProps) {
  return <RuntimeConfigContext.Provider value={value}>{children}</RuntimeConfigContext.Provider>;
}

export function useRuntimeConfig() {
  const ctx = useContext(RuntimeConfigContext);
  if (!ctx) {
    throw new Error('useRuntimeConfig must be used under <RuntimeConfigProvider>');
  }
  return ctx;
}
