import { render } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import React, { JSX } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/authContext';
import { CodeItem } from '@/libs/data-access/klass';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { fetchStaticSubjectFields, getVariableDefinitions } from '@/utils/mock-data';
import VariableDefinitionsServicePage from '.';

function renderPage(
  isAuthenticated = true,
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }> = Promise.resolve({
    data: getVariableDefinitions(),
    error: null,
  }),
  subjectFieldsPromise: Promise<{ data: CodeItem[]; error: Error | null }> = fetchStaticSubjectFields().then(
    (data) => ({
      data,
      error: null,
    }),
  ),
  searchParams = '',
) {
  return render(
    <AuthProvider isAuthenticated={isAuthenticated}>
      <VariableDefinitionsServicePage variablesPromise={variablesPromise} subjectFieldsPromise={subjectFieldsPromise} />
    </AuthProvider>,
    {
      wrapper: withNuqsTestingAdapter({
        searchParams,
      }),
    },
  );
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

vi.mock('@digdir/designsystemet-react', () => {
  const passthrough =
    (tag: keyof JSX.IntrinsicElements) =>
    ({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);
  return {
    Link: passthrough('a'),
    Heading: passthrough('h1'),
    Button: passthrough('button'),
    Spinner: passthrough('ellipse'),
    Card: passthrough('section'),
    Fieldset: passthrough('fieldset'),
    TabsPanel: passthrough('div'),
  };
});

describe('VariableDefinitionsServicePage', () => {
  it('happy path', async () => {
    const { baseElement, findByRole } = renderPage();
    await findByRole('main');
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
  it('unauthenticated - hides status filter panel', async () => {
    const { baseElement, findByRole } = renderPage();
    await findByRole('main');
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
  it('page renders while waiting for variable definitions', async () => {
    const { baseElement, findByRole } = renderPage();
    await findByRole('main');
    expect(baseElement).toBeTruthy();
    expect(baseElement).toContainHTML('<ellipse aria-label="Laster resultater..." />');
    expect(baseElement).toMatchSnapshot();
  });
  it('page renders while waiting for subject fields', async () => {
    const { baseElement, findByRole } = renderPage();
    await findByRole('main');
    expect(baseElement).toBeTruthy();
    expect(baseElement).toContainHTML('<ellipse aria-label="Laster filtere..." />');
    expect(baseElement).toMatchSnapshot();
  });
});

// TODO(jhs): Tests for URL state
