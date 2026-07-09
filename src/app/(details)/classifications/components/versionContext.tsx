'use client';

import { createContext, useContext } from 'react';
import {
  ClassificationResource,
  ClassificationVersionResource,
  ClassificationVersionSummaryResource,
} from '@/libs/data-access/klass';

export type ResolvedVersion = NonNullable<ClassificationResource['versions']>[number];

export type VersionContextType = {
  version: ClassificationVersionSummaryResource | ClassificationVersionResource;
  isLatest: boolean;
};

const VersionContext = createContext<VersionContextType | null>(null);

export function VersionProvider({
  version,
  isLatest,
  children,
}: {
  version: ClassificationResource | ClassificationVersionSummaryResource | ClassificationVersionResource;
  isLatest: boolean;
  children: React.ReactNode;
}) {
  return <VersionContext.Provider value={{ version, isLatest }}>{children}</VersionContext.Provider>;
}

// useVersion will be consumed by tab components (CodesView, VariantsView, etc.) — in progress
// fallow-ignore-next-line unused-export
export function useVersion() {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error('useVersion must be used within VersionProvider');
  return ctx;
}
