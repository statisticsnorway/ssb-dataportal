'use client';

import { RenderedVariableDefinition } from '@/libs/data-access/variable-definitions/public/models/RenderedVariableDefinition';
import { createContext, useContext } from 'react';

export type VardefTabData = {
  variableDefinitions: RenderedVariableDefinition[];
};

const VardefTabContext = createContext<VardefTabData | null>(null);

export const useVardefTabData = () => useContext(VardefTabContext);

export const VardefTabProvider = ({ value, children }: { value: VardefTabData; children: React.ReactNode }) => (
  <VardefTabContext.Provider value={value}>{children}</VardefTabContext.Provider>
);
