import { createContext, ReactNode, useContext } from 'react';
import { type DataProductDTO } from '@/libs/data-access/datadoc/models';
import { type FilterItem } from '@/types/filters';
import { type KlassCode } from '@/types/klass-codes';

interface DataProductsContextValue {
  dataProducts: DataProductDTO[];
  subjectFields: KlassCode[];
  subjectFieldFilters: FilterItem[];
  selectedSubjectCodes: string[];
}

const DataProductsContext = createContext<DataProductsContextValue | null>(null);

export const useDataProductsContext = () => {
  const context = useContext(DataProductsContext);
  if (!context) {
    throw new Error('useDataProductsContext must be used within DataProductsProvider');
  }
  return context;
};

interface DataProductsProviderProps extends DataProductsContextValue {
  children: ReactNode;
}

export const DataProductsProvider = ({ children, ...contextValue }: DataProductsProviderProps) => {
  return <DataProductsContext.Provider value={contextValue}>{children}</DataProductsContext.Provider>;
};
