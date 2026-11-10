import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { ClassificationProvider } from '@/app/(services)/classifications/classifications-service-page/components/classificationContext';
import { DataProductsProvider } from '@/app/(services)/data-products/components/dataProductsContext';
import { VariableDefinitionsProvider } from '@/app/(services)/variable-definitions/variable-definitions-service-page/components/variableDefinitionContext';
import { AuthProvider } from '@/app/authContext';
import { ClassificationType } from '@/types/classification';
import {
  mockClassificationsPromise,
  mockDataProducts,
  mockFilterItems,
  mockSearchResultsPromise,
  mockSubjectFields,
  mockSubjectFieldsPromise,
  mockVariableDefinitionsPromise,
} from './fixtures';

export function StoryAuthProvider({
  children,
  isAuthenticated = false,
}: Readonly<{ children: ReactNode; isAuthenticated?: boolean }>) {
  return <AuthProvider isAuthenticated={isAuthenticated}>{children}</AuthProvider>;
}

export function StoryNuqsProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}

export function StorySuspense({ children }: Readonly<{ children: ReactNode }>) {
  return <Suspense fallback={<div>Loading sample data…</div>}>{children}</Suspense>;
}

export function StoryClassificationProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ClassificationProvider
      classificationsPromise={mockClassificationsPromise}
      subjectFieldsPromise={mockSubjectFieldsPromise}
      searchResultPromise={mockSearchResultsPromise}
      selectedSubjectCodes={[]}
      selectedClassificationTypes={[ClassificationType.Classification]}
      sortOption='titleAsc'
      searchQuery=''
      isSearchActive={false}
    >
      {children}
    </ClassificationProvider>
  );
}

export function StoryDataProductsProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DataProductsProvider
      dataProducts={mockDataProducts}
      subjectFields={mockSubjectFields}
      subjectFieldFilters={mockFilterItems}
      selectedSubjectCodes={[]}
    >
      {children}
    </DataProductsProvider>
  );
}

export function StoryVariableDefinitionsProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <VariableDefinitionsProvider
      variablesPromise={mockVariableDefinitionsPromise}
      textFilter=''
      subjectFilters={[]}
      statusFilters={[]}
      sortOption='titleAsc'
      subjectFields={mockSubjectFields}
    >
      {children}
    </VariableDefinitionsProvider>
  );
}
