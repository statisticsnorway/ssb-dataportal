import { createContext, ReactNode, useContext, useMemo } from 'react';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';

interface VariableDefinitionsContextValue {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  textFilter: string;
  subjectFilters: FilterItem[];
  statusFilters: FilterItem[];
  sortOption: SortTypes;
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

export const VariableDefinitionsProvider = ({
  children,
  variablesPromise,
  textFilter,
  subjectFilters,
  statusFilters,
  sortOption,
}: VariableDefinitionsProviderProps) => {
  const value = useMemo(
    () => ({
      variablesPromise,
      textFilter,
      subjectFilters,
      statusFilters,
      sortOption,
    }),
    [variablesPromise, textFilter, subjectFilters, statusFilters, sortOption],
  );

  return <VariableDefinitionsContext.Provider value={value}>{children}</VariableDefinitionsContext.Provider>;
};
