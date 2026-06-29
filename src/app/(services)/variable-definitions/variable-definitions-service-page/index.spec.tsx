import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/app/authContext';
import { CodeItem } from '@/libs/data-access/klass';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language';
import { fetchStaticSubjectFields, getStaticVariableDefinitions } from '@/utils/mock-data';
import VariableDefinitionsServicePage from '.';

async function renderPage(
  isAuthenticated = true,
  variablesPromise: Promise<{ data: RenderedView[]; error: Error | null }> = Promise.resolve({
    data: getStaticVariableDefinitions(),
    error: null,
  }),
  subjectFieldsPromise?: Promise<{ data: CodeItem[]; error: Error | null }>,
  searchParams = '',
  onUrlUpdate: (event: UrlUpdateEvent) => void = vi.fn(),
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
      <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
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
      sortValue,
      onSortChange,
    }: {
      sortOptions?: readonly string[];
      sortValue?: string;
      onSortChange?: (value: string) => void;
    }) => (
      <select aria-label='Sortering' value={sortValue} onChange={(event) => onSortChange?.(event.target.value)}>
        <option value='titleAsc'>Tittel stigende</option>
        <option value='titleDesc'>Tittel synkende</option>
      </select>
    ),
  };
});

vi.mock('@/components/filters/text-filter', () => {
  return {
    TextFilter: ({
      label,
      searchTerm,
      setSearchTerm,
    }: {
      label: string;
      searchTerm?: string;
      setSearchTerm?: (value: string) => void;
    }) => (
      <input
        aria-label={label}
        type='search'
        value={searchTerm ?? ''}
        onChange={(event) => setSearchTerm?.(event.target.value)}
      />
    ),
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
  it('renders the authenticated search page', async () => {
    const { findByRole, findByLabelText } = await renderPage();
    await findByRole('main');
    expect(
      await findByLabelText(localization.search.textFilter.label, {
        selector: 'input',
      }),
    ).toBeInTheDocument();
    expect(
      await findByRole('button', {
        name: /Status/,
        hidden: true,
      }),
    ).toBeInTheDocument();
    expect(
      await findByRole('button', {
        name: /Statistikkområde/,
        hidden: true,
      }),
    ).toBeInTheDocument();
  });

  it('unauthenticated - hides status filter panel', async () => {
    const { findByRole, queryByRole, findByLabelText } = await renderPage(false);
    await findByRole('main');
    expect(
      await findByLabelText(localization.search.textFilter.label, {
        selector: 'input',
      }),
    ).toBeInTheDocument();
    expect(
      queryByRole('button', {
        name: /Status/,
        hidden: true,
      }),
    ).not.toBeInTheDocument();
    expect(
      await findByRole('button', {
        name: /Statistikkområde/,
        hidden: true,
      }),
    ).toBeInTheDocument();
  });

  it('page renders while waiting for variable definitions', async () => {
    const variablesPromise = new Promise<{ data: RenderedView[]; error: Error | null }>(() => undefined);
    const { findByRole, findByLabelText } = await renderPage(true, variablesPromise);
    await findByRole('main');
    expect(
      await findByLabelText(localization.search.textFilter.label, {
        selector: 'input',
      }),
    ).toBeInTheDocument();
    expect(await findByLabelText('Laster resultater...')).toBeInTheDocument();
  });

  it('page renders filters', async () => {
    const { findByRole, findByText, findByLabelText } = await renderPage();
    await findByRole('main');
    expect(await findByText('Filter')).toBeInTheDocument();
    expect(
      await findByLabelText(localization.search.textFilter.label, {
        selector: 'input',
      }),
    ).toBeInTheDocument();
    expect(
      await findByRole('button', {
        name: /Status/,
        hidden: true,
      }),
    ).toBeInTheDocument();
    expect(
      await findByRole('button', {
        name: /Statistikkområde/,
        hidden: true,
      }),
    ).toBeInTheDocument();
  });
});

describe('URL state', () => {
  it('hydrates search field from q parameter', async () => {
    const { findByLabelText } = await renderPage(true, undefined, undefined, '?q=inntekt');
    const searchInput = await findByLabelText(localization.search.textFilter.label, {
      selector: 'input',
    });
    expect(searchInput).toHaveValue('inntekt');
  });

  it('updates q parameter when search field changes', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    const { findByLabelText } = await renderPage(true, undefined, undefined, '', onUrlUpdate);
    const searchInput = await findByLabelText(localization.search.textFilter.label, {
      selector: 'input',
    });
    fireEvent.change(searchInput, {
      target: { value: 'inntekt' },
    });
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    const searchParams = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
    expect(searchParams?.get('q')).toBe('inntekt');
    expect(searchParams?.get('page')).toBeNull();
  });

  it('hydrates selected status filter from status parameter', async () => {
    const { findByRole } = await renderPage(true, undefined, undefined, '?status=DRAFT');
    const draftCheckbox = await findByRole('checkbox', {
      name: /Utkast/,
      hidden: true,
    });
    expect(draftCheckbox).toBeChecked();
  });

  it('updates status parameter when status filter is selected', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    const { findByRole } = await renderPage(true, undefined, undefined, '', onUrlUpdate);
    const draftCheckbox = await findByRole('checkbox', {
      name: /Utkast/,
      hidden: true,
    });
    fireEvent.click(draftCheckbox);
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    const searchParams = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
    expect(searchParams?.getAll('status')).toContain('DRAFT');
    expect(searchParams?.get('page')).toBeNull();
  });

  it('hydrates selected subject filter from subjects parameter', async () => {
    const { findByRole } = await renderPage(true, undefined, undefined, '?subjects=al');
    const subjectCheckbox = await findByRole('checkbox', {
      name: /Arbeid/,
      hidden: true,
    });
    expect(subjectCheckbox).toBeChecked();
  });

  it('updates subjects parameter when subject filter is selected', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    const { findByRole } = await renderPage(true, undefined, undefined, '', onUrlUpdate);
    const subjectCheckbox = await findByRole('checkbox', {
      name: /Arbeid/,
      hidden: true,
    });
    fireEvent.click(subjectCheckbox);
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    const searchParams = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
    expect(searchParams?.getAll('subjects')).toContain('al');
    expect(searchParams?.get('page')).toBeNull();
  });

  it('hydrates sort field from sort parameter', async () => {
    const { findByRole } = await renderPage(true, undefined, undefined, '?sort=titleDesc');
    const sortSelect = await findByRole('combobox', {
      name: 'Sortering',
      hidden: true,
    });
    expect(sortSelect).toHaveValue('titleDesc');
  });

  it('updates sort parameter when sort option changes', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    const { findByRole } = await renderPage(true, undefined, undefined, '', onUrlUpdate);
    const sortSelect = await findByRole('combobox', {
      name: 'Sortering',
      hidden: true,
    });
    fireEvent.change(sortSelect, {
      target: { value: 'titleDesc' },
    });
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });
    const searchParams = onUrlUpdate.mock.calls.at(-1)?.[0].searchParams;
    expect(searchParams?.get('sort')).toBe('titleDesc');
    expect(searchParams?.get('page')).toBeNull();
  });
});
