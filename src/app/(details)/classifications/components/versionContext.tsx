'use client';

import { createContext, useContext, useMemo } from 'react';
import { ClassificationWithLanguage } from '@/libs/data/classifications/classificationData';
import {
  ClassificationResource,
  ClassificationVersionResource,
  ClassificationVersionSummaryResource,
} from '@/libs/data-access/klass';

export type ResolvedVersion = NonNullable<ClassificationResource['versions']>[number];

type BaseVersionContextType = {
  classification: ClassificationWithLanguage;
  versionSummary: ClassificationVersionSummaryResource;
  isLatest: boolean;
};

export type VersionContextType = BaseVersionContextType & {
  versionResource?: ClassificationVersionResource;
};

const BaseVersionContext = createContext<BaseVersionContextType | null>(null);
const VersionResourceContext = createContext<ClassificationVersionResource | null>(null);

export function VersionProvider({
  classification,
  versionSummary,
  isLatest,
  children,
}: Readonly<{
  classification: ClassificationWithLanguage;
  versionSummary: ClassificationVersionSummaryResource;
  isLatest: boolean;
  children: React.ReactNode;
}>) {
  const value = useMemo(
    () => ({ classification, versionSummary, isLatest }),
    [classification, versionSummary, isLatest],
  );

  return <BaseVersionContext.Provider value={value}>{children}</BaseVersionContext.Provider>;
}

export function VersionResourceLayer({
  versionResource,
  children,
}: Readonly<{
  versionResource?: ClassificationVersionResource;
  children: React.ReactNode;
}>) {
  if (!versionResource) return <>{children}</>;
  return <VersionResourceContext.Provider value={versionResource}>{children}</VersionResourceContext.Provider>;
}
export function useVersion(): VersionContextType {
  const base = useContext(BaseVersionContext);
  if (!base) throw new Error('useVersion must be used within VersionProvider');

  const versionResource = useContext(VersionResourceContext) ?? undefined;
  return { ...base, versionResource };
}
