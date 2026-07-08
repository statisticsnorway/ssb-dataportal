'use client';

import { createContext, useContext } from 'react';
import { ClassificationResource, ClassificationVersionSummaryResource } from '@/libs/data-access/klass';

export type ResolvedVersion = NonNullable<ClassificationResource['versions']>[number];

export type VersionContextType = {
  version: ClassificationResource | ClassificationVersionSummaryResource;
  isLatest: boolean;
};

const VersionContext = createContext<VersionContextType | null>(null);

export function VersionProvider({
  version,
  isLatest,
  children,
}: {
  version: ClassificationResource | ClassificationVersionSummaryResource;
  isLatest: boolean;
  children: React.ReactNode;
}) {
  return <VersionContext.Provider value={{ version, isLatest }}>{children}</VersionContext.Provider>;
}

export function useVersion() {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error('useVersion must be used within VersionProvider');
  return ctx;
}
