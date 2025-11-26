'use client';

import { createContext, useContext } from 'react';
import { RenderedVariableDefinition } from '@/libs/data-access/variable-definitions/public/models/RenderedVariableDefinition';

export type VardefTabData = {
  variableDefinitions: RenderedVariableDefinition[];
};

const VardefTabContext = createContext<VardefTabData | null>(null);

export const useVardefTabData = () => useContext(VardefTabContext);

export const VardefTabProvider = ({ value, children }: { value: VardefTabData; children: React.ReactNode }) => (
  <VardefTabContext.Provider value={value}>{children}</VardefTabContext.Provider>
);
