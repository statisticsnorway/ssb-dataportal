import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ClassificationResource, ClassificationVersionResource, CodeChangeItem } from '@/libs/data-access/klass';
import ChangesView from './ChangesView';

vi.mock('next/navigation', () => ({
  usePathname: () => '/classifications/2003/changes',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const fetchChangesMock = vi.hoisted(() => vi.fn<() => Promise<CodeChangeItem[]>>());

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
  ExpandableTable: () => <div data-testid='expandable-table' />,
}));

describe('ChangesView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates the table version titles when inverted', async () => {
    fetchChangesMock.mockResolvedValue([
      {
        oldCode: 'old-code',
        oldName: 'Old name',
        newCode: 'new-code',
        newName: 'New name',
      },
    ]);

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

    await waitFor(() => expect(screen.getByText('v30')).toBeInTheDocument());
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['v30', 'v31']);

    fireEvent.click(screen.getAllByRole('button')[0] as HTMLButtonElement);

    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['v31', 'v30']);
  });

  it('fetches changes only once for stable inputs', async () => {
    fetchChangesMock.mockResolvedValue([]);

    fetchChangesMock.mockResolvedValue([]);

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
});
