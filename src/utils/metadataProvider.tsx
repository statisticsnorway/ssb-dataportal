import { ReactNode } from 'react';
import { ClassificationFamilyResource, ClassificationResource } from '@/libs/data-access/klass';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal/models/RenderedView';
import { KlassTabProvider } from './klassTabContext';
import { VardefTabProvider } from './vardefTabContext';

type MetadataProvidersProps = {
  children: ReactNode;
  klassData: {
    klassClassificationFamilies: ClassificationFamilyResource[];
    klassClassifications: ClassificationResource[];
  };
  vardefData: {
    variableDefinitions: RenderedView[];
  };
};

export const MetadataProviders = ({ children, klassData, vardefData }: MetadataProvidersProps) => (
  <KlassTabProvider value={klassData}>
    <VardefTabProvider value={vardefData}>{children}</VardefTabProvider>
  </KlassTabProvider>
);
