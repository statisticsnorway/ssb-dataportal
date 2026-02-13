'use client';
import { createContext, ReactNode, useContext } from 'react';
import { useFilteredVariables } from '@/hooks/useFilteredVariables';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { FilterItem } from '@/types/filters';
import { SortTypes } from '@/types/sort';

interface VariableDefinitionsContextValue {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  textFilter: string;
  subjectFilters: FilterItem[];
  sortOption: SortTypes;
  filteredVariables: RenderedView[];
  error: Error | null;
}

const VariableDefinitionsContext = createContext<VariableDefinitionsContextValue | null>(null);

export const useVariableDefinitionsContext = () => {
  const context = useContext(VariableDefinitionsContext);
  if (!context) {
    throw new Error('useVariableDefinitionsContext must be used within VariableDefinitionsProvider');
  }
  return context;
};

interface VariableDefinitionsProviderProps {
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }>;
  textFilter: string;
  subjectFilters: FilterItem[];
  sortOption: SortTypes;
  children: ReactNode;
}

export const VariableDefinitionsProvider = ({
  children,
  variablesPromise,
  textFilter,
  subjectFilters,
  sortOption,
}: VariableDefinitionsProviderProps) => {
  const { filteredVariables, error } = useFilteredVariables({
    variablesPromise,
    textFilter,
    subjectFilters,
    sortOption,
  });

  return (
    <VariableDefinitionsContext.Provider
      value={{
        variablesPromise,
        textFilter,
        subjectFilters,
        sortOption,
        filteredVariables,
        error,
      }}
    >
      {children}
    </VariableDefinitionsContext.Provider>
  );
};
