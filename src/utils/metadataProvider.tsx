import { createContext, ReactNode, useContext } from 'react';
import { Classification, ClassificationFamily } from '@/types/classification';
import { VariableDefinitionType } from '@/types/variableDefinition';
import { KlassTabData, KlassTabProvider } from './klassTabContext';
import { VardefTabData, VardefTabProvider } from './vardefTabContext';

type MetadataProvidersProps = {
  children: ReactNode;
  klassData: {
    klassClassificationFamilies: ClassificationFamily[];
    klassClassifications: Classification[];
  };
  vardefData: {
    variableDefinitions: VariableDefinitionType[];
  };
};

type MetadataContextType = {
  klassData: KlassTabData;
  vardefData: VardefTabData;
};

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const MetadataProviders = ({ children, klassData, vardefData }: MetadataProvidersProps) => (
  <KlassTabProvider value={klassData}>
    <VardefTabProvider value={vardefData}>{children}</VardefTabProvider>
  </KlassTabProvider>
);

export const useMetadata = () => {
  const ctx = useContext(MetadataContext);
  if (!ctx) throw new Error('useMetadata must be used inside MetadataProviders');
  return ctx;
};
