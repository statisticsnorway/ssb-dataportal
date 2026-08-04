import { createContext, ReactNode, useContext } from 'react';
import { ClassificationResource } from '@/libs/data-access/klass';
import { SearchResultResource } from '@/libs/data-access/klass/models';
import { ClassificationType } from '@/types/classification';
import { KlassCode } from '@/types/klass-codes';
import { SortTypes } from '@/types/sort';

interface ClassificationContextValue {
  classificationsPromise: Promise<{ data: ClassificationResource[]; error: Error | null }>;
  subjectFieldsPromise: Promise<{ data: KlassCode[]; error: Error | null }>;
  searchResultPromise: Promise<{ data: SearchResultResource[]; error: Error | null }>;
  selectedSubjectCodes: string[];
  selectedClassificationTypes: ClassificationType[];
  sortOption: SortTypes;
  searchQuery: string;
  isSearchActive: boolean;
}

const ClassificationContext = createContext<ClassificationContextValue | null>(null);

export const useClassificationContext = () => {
  const context = useContext(ClassificationContext);
  if (!context) {
    throw new Error('useClassificationContext must be used within ClassificationProvider');
  }
  return context;
};

interface ClassificationProviderProps extends ClassificationContextValue {
  children: ReactNode;
}

export const ClassificationProvider = ({ children, ...contextValue }: ClassificationProviderProps) => {
  return <ClassificationContext.Provider value={contextValue}>{children}</ClassificationContext.Provider>;
};
