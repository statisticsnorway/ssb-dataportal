import { act, render } from '@testing-library/react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/authContext';
import { CodeItem } from '@/libs/data-access/klass';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { fetchStaticSubjectFields, getVariableDefinitions } from '@/utils/mock-data';
import VariableDefinitionsServicePage from '.';

async function renderPage(
  isAuthenticated = true,
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }> = Promise.resolve({
    data: getVariableDefinitions(),
    error: null,
  }),
  subjectFieldsPromise?: Promise<{ data: CodeItem[]; error: Error | null }>,
  searchParams = '',
) {
  let resolvedSubjectFieldsPromise = subjectFieldsPromise;
  if (!resolvedSubjectFieldsPromise) {
    const subjectFields = await fetchStaticSubjectFields();
    resolvedSubjectFieldsPromise = Promise.resolve({
      data: subjectFields,
      error: null,
    });
  }

  let result: ReturnType<typeof render>;

  await act(async () => {
    result = render(
      <NuqsTestingAdapter searchParams={searchParams}>
        <AuthProvider isAuthenticated={isAuthenticated}>
          <VariableDefinitionsServicePage
            variablesPromise={variablesPromise}
            subjectFieldsPromise={resolvedSubjectFieldsPromise}
          />
        </AuthProvider>
      </NuqsTestingAdapter>,
    );
  });

  return result!;
}

vi.mock('@/components/sort-fields', () => {
  return {
    SortFields: ({
      children,
      sortOptions,
      sortValue,
      onSortChange,
      ...props
    }: {
      children?: React.ReactNode;
      sortOptions?: unknown;
      sortValue?: string;
      onSortChange?: (value: string) => void;
    } & React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props}>{children}</select>,
  };
});

vi.mock('@/components/filters/text-filter', () => {
  return {
    TextFilter: ({
      children,
      searchTerm,
      setSearchTerm,
      ...props
    }: {
      children?: React.ReactNode;
      searchTerm?: string;
      setSearchTerm?: (value: string) => void;
    } & React.InputHTMLAttributes<HTMLInputElement>) => React.createElement('input', props, children),
  };
});

vi.mock('@digdir/designsystemet-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@digdir/designsystemet-react')>();

  return {
    ...actual,
    Spinner: ({ ...props }) => <div {...props} />,
  };
});

describe('VariableDefinitionsServicePage', () => {
  it('happy path', async () => {
    const { baseElement, findByRole } = await renderPage();
    await findByRole('main');
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
  it('unauthenticated - hides status filter panel', async () => {
    const { baseElement, findByRole } = await renderPage(false);
    await findByRole('main');
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
  it('page renders while waiting for variable definitions', async () => {
    const neverResolvingPromise = <T,>() => new Promise<T>(() => {});
    const variablesPromise = neverResolvingPromise<{ data: RenderedView[]; error: Error | null }>();
    const { baseElement, findByRole, findByLabelText } = await renderPage(true, variablesPromise);
    await findByRole('main');
    await findByLabelText('Laster resultater...');
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
  it('page renders filters', async () => {
    const { baseElement, findByRole, findByText } = await renderPage();
    await findByRole('main');
    await findByText('Filter');
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});

// TODO(jhs): Tests for URL state
