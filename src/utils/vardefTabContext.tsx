'use client';

import { VariableDefinitionType } from '@/types/variableDefinition';
import { createContext, useContext } from 'react';

export type VardefTabData = {
  variableDefinitions: VariableDefinitionType[];
};

const VardefTabContext = createContext<VardefTabData | null>(null);

export const useVardefTabData = () => useContext(VardefTabContext);

export const VardefTabProvider = ({ value, children }: { value: VardefTabData; children: React.ReactNode }) => (
  <VardefTabContext.Provider value={value}>{children}</VardefTabContext.Provider>
);
