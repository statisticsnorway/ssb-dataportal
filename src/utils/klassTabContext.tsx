'use client';

import { createContext, useContext } from 'react';
import { Classification, ClassificationFamily } from '@/types/classification';

export type KlassTabData = {
  klassClassificationFamilies: ClassificationFamily[];
  klassClassifications: Classification[];
};

const KlassTabContext = createContext<KlassTabData | null>(null);

export const useKlassTabData = () => {
  const context = useContext(KlassTabContext);
  if (!context) {
    throw new Error('useKlassTabData must be used within a KlassTabProvider');
  }
  return context;
};

export const KlassTabProvider = ({ value, children }: { value: KlassTabData; children: React.ReactNode }) => (
  <KlassTabContext.Provider value={value}>{children}</KlassTabContext.Provider>
);
