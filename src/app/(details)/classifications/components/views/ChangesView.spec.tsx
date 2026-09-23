import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FetchChangesResult } from '@/libs/data/classifications/codesData';
import type { ClassificationResource, ClassificationVersionResource } from '@/libs/data-access/klass';
import { localization } from '@/libs/language';
import ChangesView from './ChangesView';

vi.mock('next/navigation', () => ({
  usePathname: () => '/classifications/2003/changes',
}));

const fetchChangesMock = vi.hoisted(() => vi.fn<() => Promise<FetchChangesResult>>());
const correspondenceTableMock = vi.hoisted(() => vi.fn());

vi.mock('@/libs/data/classifications/codesData', () => ({
  fetchChanges: fetchChangesMock,
}));

vi.mock('@digdir/designsystemet-react', () => ({
  Alert: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type='button' onClick={onClick}>
      {children}
    </button>
  ),
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  Paragraph: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  Spinner: ({ 'aria-label': ariaLabel }: { 'aria-label': string }) => <div aria-label={ariaLabel} />,
  Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
  TableHead: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
  TableHeaderCell: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
}));

vi.mock('../classification-table', () => ({
  ClassificationTable: () => <div data-testid='classification-table' />,
}));

vi.mock('../expandable-table', () => ({
  ExpandableTable: ({ table, message }: { table?: React.ReactNode; message?: string }) => (
    <div data-testid='expandable-table'>
      {table}
      {message}
    </div>
  ),
}));

vi.mock('../correspondence-table', () => ({
  CorrespondenceTable: (props: unknown) => {
    correspondenceTableMock(props);
    return <div data-testid='correspondence-table' />;
  },
}));

describe('ChangesView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localization.setLanguage('nb');
  });

  it('passes changes to CorrespondenceTable as mappings', async () => {
    fetchChangesMock.mockResolvedValue({
      status: 'success',
      changes: [
        {
          oldCode: 'old-code',
          oldName: 'Old name',
          newCode: 'new-code',
          newName: 'New name',
        },
      ],
    });

    const previousVersion: ClassificationVersionResource = {
      id: 30,
      name: 'v30',
      validFrom: new Date('1994-01-01'),
      validTo: new Date('1994-12-31'),
    };

    const currentVersion: ClassificationVersionResource = {
      id: 31,
      name: 'v31',
      validFrom: new Date('2009-01-01'),
      validTo: new Date('2009-12-31'),
    };

    render(
      <ChangesView classification={{ id: 6, versions: [previousVersion, currentVersion] }} version={currentVersion} />,
    );

    await waitFor(() => expect(correspondenceTableMock).toHaveBeenCalled());

    expect(correspondenceTableMock).toHaveBeenLastCalledWith({
      sourceName: 'v30',
      targetName: 'v31',
      mappings: [
        {
          sourceCode: 'old-code',
          sourceName: 'Old name',
          targetCode: 'new-code',
          targetName: 'New name',
        },
      ],
      downloadHref: '/classifications/2003/changes/download?v=1&format=csv&language=nb',
      onDownloadClick: expect.any(Function),
      tableLabel: 'Tabell over kodeendringer',
    });
  });

  it('fetches changes only once for stable inputs', async () => {
    fetchChangesMock.mockResolvedValue({ status: 'success', changes: [] });

    const previousVersion: ClassificationVersionResource = {
      id: 30,
      name: 'v30',
      validFrom: new Date('1994-01-01'),
      validTo: new Date('1994-12-31'),
    };

    const currentVersion: ClassificationVersionResource = {
      id: 31,
      name: 'v31',
      validFrom: new Date('2009-01-01'),
      validTo: new Date('2009-12-31'),
    };

    const classification: ClassificationResource = {
      id: 6,
      versions: [previousVersion, currentVersion],
    };

    render(<ChangesView classification={classification} version={currentVersion} />);

    await waitFor(() => expect(fetchChangesMock).toHaveBeenCalledTimes(1));
  });

  it('shows no code changes for a successful empty response', async () => {
    fetchChangesMock.mockResolvedValue({ status: 'success', changes: [] });

    const previousVersion: ClassificationVersionResource = {
      id: 30,
      name: 'v30',
      validFrom: new Date('1994-01-01'),
    };
    const currentVersion: ClassificationVersionResource = {
      id: 31,
      name: 'v31',
      validFrom: new Date('2009-01-01'),
    };

    render(
      <ChangesView classification={{ id: 6, versions: [previousVersion, currentVersion] }} version={currentVersion} />,
    );

    expect(await screen.findByText(localization.versions.noChanges)).toBeInTheDocument();
    expect(screen.queryByTestId('correspondence-table')).not.toBeInTheDocument();
    expect(screen.queryByText('Feilkode: 404')).not.toBeInTheDocument();
  });

  it('shows the specific 404 error without affecting the changelog', async () => {
    const sourceName = 'Næringsgruppering 2007 (SN 2007)';
    const targetName = 'Næringsgruppering (SN) 2025';
    const klassResponseMessage =
      'Næringsgruppering 2007 (SN 2007) has no change table (correspondenceTable) with: Næringsgruppering (SN) 2025';
    fetchChangesMock.mockResolvedValue({
      status: 'not-found',
      statusCode: 404,
      message: klassResponseMessage,
    });

    const previousVersion: ClassificationVersionResource = {
      id: 30,
      name: 'Næringsgruppering 2007 (SN 2007)',
      validFrom: new Date('2008-01-01'),
    };
    const currentVersion: ClassificationVersionResource = {
      id: 3218,
      name: 'Næringsgruppering (SN) 2025',
      validFrom: new Date('2025-01-01'),
      changelogs: [{ description: 'A changelog entry', changeOccured: new Date('2025-01-01') }],
    };

    render(
      <ChangesView classification={{ id: 6, versions: [previousVersion, currentVersion] }} version={currentVersion} />,
    );

    expect(await screen.findByText(`${sourceName} har ingen endringstabell mot: ${targetName}`)).toBeInTheDocument();
    expect(screen.getByText('Feilkode: 404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kodeendringer ikke funnet' })).toBeInTheDocument();
    const helpItems = screen.getAllByRole('listitem');
    expect(helpItems).toHaveLength(2);
    expect(helpItems[0]).toHaveTextContent(localization.error.helpRegisterChangeTable);
    expect(helpItems[1]).toHaveTextContent(localization.error.helpReload);
    expect(screen.queryByText(localization.versions.noChanges)).not.toBeInTheDocument();
    expect(screen.queryByTestId('correspondence-table')).not.toBeInTheDocument();
    expect(screen.getByTestId('expandable-table')).toBeInTheDocument();
    expect(screen.getByTestId('classification-table')).toBeInTheDocument();
  });
});
