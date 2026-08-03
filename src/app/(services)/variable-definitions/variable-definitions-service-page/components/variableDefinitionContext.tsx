import { createContext, ReactNode, useContext } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { KlassCode } from '@/types/klass-codes';
import { SortTypes } from '@/types/sort';

interface VariableDefinitionsContextValue {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  textFilter: string;
  subjectFilters: FilterItem[];
  statusFilters: FilterItem[];
  sortOption: SortTypes;
  subjectFields: KlassCode[];
}

const VariableDefinitionsContext = createContext<VariableDefinitionsContextValue | null>(null);

export const useVariableDefinitionsContext = () => {
  const context = useContext(VariableDefinitionsContext);
  if (!context) {
    throw new Error('useVariableDefinitionsContext must be used within VariableDefinitionsProvider');
  }
  return context;
};

interface VariableDefinitionsProviderProps extends VariableDefinitionsContextValue {
  children: ReactNode;
}

export const VariableDefinitionsProvider = ({ children, ...contextValue }: VariableDefinitionsProviderProps) => {
  return <VariableDefinitionsContext.Provider value={contextValue}>{children}</VariableDefinitionsContext.Provider>;
};
