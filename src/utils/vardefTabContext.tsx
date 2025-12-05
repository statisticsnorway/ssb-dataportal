'use client';

import { createContext, useContext } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';

export type VardefTabData = {
  variableDefinitions: RenderedView[];
};

const VardefTabContext = createContext<VardefTabData | null>(null);

export const useVardefTabData = () => useContext(VardefTabContext);

export const VardefTabProvider = ({ value, children }: { value: VardefTabData; children: React.ReactNode }) => (
  <VardefTabContext.Provider value={value}>{children}</VardefTabContext.Provider>
);
