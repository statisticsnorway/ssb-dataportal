/** biome-ignore-all lint/suspicious/noExplicitAny: Component mocks intentionally accept the library props loosely. */
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing';
import { describe, expect, it, vi } from 'vitest';
import { CorrespondenceTableWithDirection } from './correspondence-table-with-direction';

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

const mappings = [{ sourceCode: '01', sourceName: 'Oslo', targetCode: '0301', targetName: 'Oslo' }];
const downloadHref = '/classifications/6/correspondences/2919/download?v=1&format=csv&language=nb';

function renderWithDirection(searchParams = '', onUrlUpdate?: (event: UrlUpdateEvent) => void) {
  return render(
    <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
      <CorrespondenceTableWithDirection
        sourceName='Kommuneinndeling 2012'
        targetName='Arbeidsgiveravgiftssoner 2012'
        mappings={mappings}
        downloadHref={downloadHref}
      />
    </NuqsTestingAdapter>,
  );
}

describe('CorrespondenceTableWithDirection', () => {
  it('leaves the download link untouched in the stored direction', () => {
    renderWithDirection();

    expect(screen.getByRole('link', { name: 'Last ned' })).toHaveAttribute('href', downloadHref);
  });

  it('reads the direction from the url and points the download at it', () => {
    renderWithDirection('?inverted=true');

    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Arbeidsgiveravgiftssoner 2012');
    expect(screen.getByRole('link', { name: 'Last ned' })).toHaveAttribute('href', `${downloadHref}&inverted=true`);
  });

  it('writes the direction to the url when toggled', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn();
    renderWithDirection('', onUrlUpdate);

    await user.click(screen.getByRole('button', { name: 'Inverter tabell' }));

    expect(onUrlUpdate).toHaveBeenCalled();
    expect(onUrlUpdate.mock.calls.at(-1)?.[0].queryString).toContain('inverted=true');
  });

  it('clears the flag from the url when toggled back', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn();
    renderWithDirection('?inverted=true', onUrlUpdate);

    await user.click(screen.getByRole('button', { name: 'Inverter tabell' }));

    expect(onUrlUpdate.mock.calls.at(-1)?.[0].queryString).not.toContain('inverted');
  });
});
