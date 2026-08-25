/** biome-ignore-all lint/suspicious/noExplicitAny: Component mocks intentionally accept the library props loosely. */
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CorrespondenceTable } from './index';

vi.mock('@digdir/designsystemet-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@digdir/designsystemet-react')>();
  return {
    ...actual,
    Alert: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Button: ({ asChild, children, ...props }: any) => (asChild ? children : <button {...props}>{children}</button>),
    Search: Object.assign(({ children, ...props }: any) => <div {...props}>{children}</div>, {
      Input: (props: any) => <input {...props} />,
      Clear: ({ children, ...props }: any) => <button {...props}>{children}</button>,
      Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    }),
    Table: ({ children, ...props }: any) => <table {...props}>{children}</table>,
    TableBody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
    TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
    TableHead: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
    TableHeaderCell: ({ children, ...props }: any) => <th {...props}>{children}</th>,
    TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  };
});

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

function renderTable(tableMappings = mappings) {
  return render(
    <CorrespondenceTable
      sourceName='Næringsgruppering 2025'
      targetName='Næringsgruppering 2007 '
      mappings={tableMappings}
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
    expect(screen.getAllByRole('columnheader')[0]).toHaveAttribute('scope', 'colgroup');
    expect(screen.getAllByRole('columnheader')[1]).toHaveAttribute('scope', 'colgroup');
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

  it('filters mappings by code or name on either side', async () => {
    const user = userEvent.setup();
    renderTable();
    const filter = screen.getByRole('textbox', { name: 'Filtrer på kode eller navn' });
    await user.type(filter, 'skog');
    expect(screen.getByText('02.110')).toBeInTheDocument();
    expect(screen.getByText('Skogskjøtsel')).toBeInTheDocument();
    expect(screen.queryByText('01.479')).not.toBeInTheDocument();
    expect(screen.queryByText('01.620')).not.toBeInTheDocument();
    await user.clear(filter);
    await user.type(filter, '01.620');
    expect(screen.getByText('01.479')).toBeInTheDocument();
    expect(screen.getByText('01.620')).toBeInTheDocument();
    expect(screen.queryByText('02.110')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fjern filter' }));
    expect(screen.getByText('02.110')).toBeInTheDocument();
    expect(screen.getAllByText('01.490')).toHaveLength(2);
  });

  it('shows a status message when the filter has no matches', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.type(screen.getByRole('textbox', { name: 'Filtrer på kode eller navn' }), 'finnes ikke');
    expect(screen.getByRole('status')).toHaveTextContent('0 treff');
    expect(screen.queryByRole('table', { name: 'Korrespondansetabell' })).not.toBeInTheDocument();
  });

  it('uses a table label when provided', () => {
    render(
      <CorrespondenceTable
        sourceName='Versjon 2024'
        targetName='Versjon 2025'
        mappings={mappings}
        downloadHref='/changes/download'
        tableLabel='Tabell over kodeendringer'
      />,
    );
    expect(screen.getByRole('table', { name: 'Tabell over kodeendringer' })).toBeInTheDocument();
  });
});
