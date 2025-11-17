import { ReactNode } from 'react';
import { Classification, ClassificationFamily } from '@/types/classification';
import { VariableDefinitionType } from '@/types/variableDefinition';
import { KlassTabProvider } from './klassTabContext';
import { VardefTabProvider } from './vardefTabContext';

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

export const MetadataProviders = ({ children, klassData, vardefData }: MetadataProvidersProps) => (
  <KlassTabProvider value={klassData}>
    <VardefTabProvider value={vardefData}>{children}</VardefTabProvider>
  </KlassTabProvider>
);
