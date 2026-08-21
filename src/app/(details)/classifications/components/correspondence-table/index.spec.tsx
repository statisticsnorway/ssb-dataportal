/** biome-ignore-all lint/suspicious/noExplicitAny: Component mocks intentionally accept the library props loosely. */
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CorrespondenceTable } from './index';

vi.mock('@digdir/designsystemet-react', () => ({
  Button: ({ asChild, children, ...props }: any) => (asChild ? children : <button {...props}>{children}</button>),
  Table: ({ children, ...props }: any) => <table {...props}>{children}</table>,
  TableBody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
  TableHead: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
  TableHeaderCell: ({ children, ...props }: any) => <th {...props}>{children}</th>,
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
}));

const mappings = [
  {
    sourceCode: '01.479',
    sourceName: 'Annet fjørfehold',
    targetCode: '01.490',
    targetName: 'Husdyrhold ellers',
  },
  {
    sourceCode: '01.479',
    sourceName: 'Annet fjørfehold',
    targetCode: '01.620',
    targetName: 'Tjenester tilknyttet husdyrhold',
  },
  {
    sourceCode: '02.110',
    sourceName: 'Skogskjøtsel',
    targetCode: '01.490',
    targetName: 'Husdyrhold ellers',
  },
];

function renderTable() {
  return render(
    <CorrespondenceTable
      sourceName='Næringsgruppering 2025'
      targetName='Næringsgruppering 2007'
      mappings={mappings}
      downloadHref='/classifications/6/versions/3218/correspondences/2919/download?v=1&format=csv&language=nb'
    />,
  );
}

describe('CorrespondenceTable', () => {
  it('shows every mapping in a flat table without hierarchy controls', () => {
    renderTable();

    expect(screen.getByRole('table', { name: 'Korrespondansetabell' })).toBeInTheDocument();
    expect(screen.getByText('01.479')).toBeInTheDocument();
    expect(screen.getByText('01.479').closest('td')).toHaveAttribute('rowspan', '2');
    expect(screen.getAllByText('01.490')).toHaveLength(2);
    expect(screen.getByText('01.620')).toBeInTheDocument();
    expect(screen.getAllByRole('rowgroup')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Last ned' })).toHaveAttribute(
      'href',
      '/classifications/6/versions/3218/correspondences/2919/download?v=1&format=csv&language=nb',
    );
    expect(screen.queryByRole('button', { name: 'Åpne hierarkiet' })).not.toBeInTheDocument();
  });

  it('inverts the columns and mapping direction', async () => {
    const user = userEvent.setup();
    renderTable();

    await user.click(screen.getByRole('button', { name: 'Inverter tabell' }));

    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('Næringsgruppering 2007');
    expect(headers[1]).toHaveTextContent('Næringsgruppering 2025');
    const firstRowCells = screen.getAllByRole('row')[1]?.querySelectorAll('td');
    expect(firstRowCells?.[0]).toHaveTextContent('01.490');
    expect(firstRowCells?.[0]).toHaveAttribute('rowspan', '2');
    expect(firstRowCells?.[1]).toHaveTextContent('Husdyrhold ellers');
    expect(firstRowCells?.[1]).toHaveAttribute('rowspan', '2');
    expect(firstRowCells?.[2]).toHaveTextContent('01.479');
  });
});
