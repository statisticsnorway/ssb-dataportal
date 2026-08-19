import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ClassificationResource, ClassificationVersionResource, CodeChangeItem } from '@/libs/data-access/klass';
import ChangesView from './ChangesView';

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

vi.mock('@/app/(details)/classifications/components/download-dialog', () => ({
  DownloadChangesDialog: () => <div data-testid='download-dialog' />,
}));

describe('ChangesView', () => {
  it('fetches changes only once for stable inputs', async () => {
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
