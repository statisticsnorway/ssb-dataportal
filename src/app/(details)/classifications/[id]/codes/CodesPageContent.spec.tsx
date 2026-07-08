import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { KlassCode } from '@/types/klass-codes';
import { CodesPageContent } from './CodesPageContent';

vi.mock('@/components/code-tree', () => ({
  CodeTree: ({ codes }: { codes: KlassCode[] }) => (
    <ul aria-label='filtered-codes'>
      {codes.map((code) => (
        <li key={code.code}>{`${code.code}:${code.name}`}</li>
      ))}
    </ul>
  ),
}));

function makeCode(overrides: Partial<KlassCode> & { code: string; level: string }): KlassCode {
  return {
    parentCode: null,
    name: `Code ${overrides.code}`,
    validFrom: '2020-01-01',
    ...overrides,
  };
}

const CODES: KlassCode[] = [
  makeCode({ code: 'A', level: '1', name: 'Animals' }),
  makeCode({ code: 'A1', level: '2', parentCode: 'A', name: 'Cats' }),
  makeCode({ code: 'A2', level: '2', parentCode: 'A', name: 'Dogs' }),
  makeCode({ code: 'B', level: '1', name: 'Boats' }),
];

describe('CodesPageContent', () => {
  it('renders all codes before filters are applied', () => {
    render(<CodesPageContent codes={CODES} />);

    expect(screen.getByText('A:Animals')).toBeInTheDocument();
    expect(screen.getByText('A1:Cats')).toBeInTheDocument();
    expect(screen.getByText('A2:Dogs')).toBeInTheDocument();
    expect(screen.getByText('B:Boats')).toBeInTheDocument();
  });

  it.each([
    { searchTerm: 'A1', visible: 'A1:Cats', hidden: 'A2:Dogs' },
    { searchTerm: 'dog', visible: 'A2:Dogs', hidden: 'A1:Cats' },
    { searchTerm: 'cat', visible: 'A1:Cats', hidden: 'A2:Dogs' },
  ])('filters with "$searchTerm" using a single filter field', ({ searchTerm, visible, hidden }) => {
    render(<CodesPageContent codes={CODES} />);

    fireEvent.change(screen.getByLabelText('Filtrer på kode eller navn'), { target: { value: searchTerm } });

    expect(screen.getByText('A:Animals')).toBeInTheDocument();
    expect(screen.getByText(visible)).toBeInTheDocument();
    expect(screen.queryByText(hidden)).not.toBeInTheDocument();
    expect(screen.queryByText('B:Boats')).not.toBeInTheDocument();
  });
});
