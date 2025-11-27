import { ReactNode } from 'react';
import { CompleteResponse } from '@/libs/data-access/variable-definitions/internal/models/CompleteResponse';
import { Classification, ClassificationFamily } from '@/types/classification';
import { KlassTabProvider } from './klassTabContext';
import { VardefTabProvider } from './vardefTabContext';

type MetadataProvidersProps = {
  children: ReactNode;
  klassData: {
    klassClassificationFamilies: ClassificationFamily[];
    klassClassifications: Classification[];
  };
  vardefData: {
    variableDefinitions: CompleteResponse[];
  };
};

export const MetadataProviders = ({ children, klassData, vardefData }: MetadataProvidersProps) => (
  <KlassTabProvider value={klassData}>
    <VardefTabProvider value={vardefData}>{children}</VardefTabProvider>
  </KlassTabProvider>
);
