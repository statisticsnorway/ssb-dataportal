/** biome-ignore-all lint/suspicious/noExplicitAny: Use any in mocks for convenience */
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { KlassCode } from '@/types/klass-codes';
import { CodeTree } from './index';

vi.mock('@digdir/designsystemet-react', () => ({
  Button: ({ children, onClick, 'aria-expanded': ariaExpanded, ...props }: any) => (
    <button type='button' onClick={onClick} aria-expanded={ariaExpanded} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@navikt/aksel-icons', () => ({
  ChevronRightIcon: () => <span data-testid='chevron-right' />,
  ChevronDownIcon: () => <span data-testid='chevron-down' />,
}));

function makeCode(overrides: Partial<KlassCode> & { code: string; level: string }): KlassCode {
  return {
    parentCode: null,
    name: `Code ${overrides.code}`,
    validFrom: '2020-01-01',
    ...overrides,
  };
}

const FLAT_CODES: KlassCode[] = [makeCode({ code: 'A', level: '1' }), makeCode({ code: 'B', level: '1' })];

const NESTED_CODES: KlassCode[] = [
  makeCode({ code: 'A', level: '1' }),
  makeCode({ code: 'A1', level: '2', parentCode: 'A', name: 'Child A1' }),
  makeCode({ code: 'A2', level: '2', parentCode: 'A', name: 'Child A2' }),
  makeCode({ code: 'B', level: '1' }),
];

describe('CodeTree', () => {
  it('renders an empty tree when codes is empty', () => {
    render(<CodeTree codes={[]} />);

    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Velg kode/ })).not.toBeInTheDocument();
  });

  it('renders leaf codes without a toolbar', () => {
    render(<CodeTree codes={FLAT_CODES} />);
    expect(screen.queryByRole('button', { name: /Åpne alle|Lukk alle/ })).not.toBeInTheDocument();
    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('renders each leaf code as a labelled row button', () => {
    render(<CodeTree codes={FLAT_CODES} />);
    expect(screen.getByRole('button', { name: /Velg kode A/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Velg kode B/ })).toBeInTheDocument();
  });

  it('shows the expand-all toolbar button when parent codes exist', () => {
    render(<CodeTree codes={NESTED_CODES} />);
    expect(screen.getByRole('button', { name: 'Åpne alle' })).toBeInTheDocument();
  });

  it('clicking expand-all expands all parent nodes', async () => {
    const user = userEvent.setup();
    render(<CodeTree codes={NESTED_CODES} />);

    expect(screen.queryByRole('button', { name: /Velg kode A1/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Åpne alle' }));

    expect(screen.getByRole('button', { name: /Velg kode A1/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Velg kode A2/ })).toBeInTheDocument();
  });

  it('clicking expand-all changes the toolbar to collapse-all', async () => {
    const user = userEvent.setup();
    render(<CodeTree codes={NESTED_CODES} />);

    await user.click(screen.getByRole('button', { name: 'Åpne alle' }));

    expect(screen.getByRole('button', { name: 'Lukk alle' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Åpne alle' })).not.toBeInTheDocument();
  });

  it('clicking collapse-all hides children again', async () => {
    const user = userEvent.setup();
    render(<CodeTree codes={NESTED_CODES} />);

    await user.click(screen.getByRole('button', { name: 'Åpne alle' }));
    await user.click(screen.getByRole('button', { name: 'Lukk alle' }));

    expect(screen.queryByRole('button', { name: /Velg kode A1/ })).not.toBeInTheDocument();
  });

  it('leaf row body starts with aria-pressed=false', () => {
    render(<CodeTree codes={FLAT_CODES} />);
    const btn = screen.getByRole('button', { name: /Velg kode A/ });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking a row body sets it as selected (aria-pressed=true)', async () => {
    const user = userEvent.setup();
    render(<CodeTree codes={FLAT_CODES} />);
    const btn = screen.getByRole('button', { name: /Velg kode A/ });

    await user.click(btn);

    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('selecting a code deselects the previously selected one', async () => {
    const user = userEvent.setup();
    render(<CodeTree codes={FLAT_CODES} />);

    await user.click(screen.getByRole('button', { name: /Velg kode A/ }));
    await user.click(screen.getByRole('button', { name: /Velg kode B/ }));

    expect(screen.getByRole('button', { name: /Velg kode A/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /Velg kode B/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onChange with the clicked KlassCode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CodeTree codes={FLAT_CODES} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Velg kode A/ }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ code: 'A' }));
  });

  it('clicking the row body of a parent node also expands its children', async () => {
    const user = userEvent.setup();
    render(<CodeTree codes={NESTED_CODES} />);

    await user.click(screen.getByRole('button', { name: /Velg kode A/ }));

    expect(screen.getByRole('button', { name: /Velg kode A1/ })).toBeInTheDocument();
  });

  it('clicking the chevron on a parent expands children without changing selection', async () => {
    const user = userEvent.setup();
    render(<CodeTree codes={NESTED_CODES} />);

    const chevronBtn = screen.getByRole('button', { name: /Vis underkoder for Code A/ });
    await user.click(chevronBtn);

    expect(screen.getByRole('button', { name: /Velg kode A1/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Velg kode A:/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking the chevron again collapses the children', async () => {
    const user = userEvent.setup();
    render(<CodeTree codes={NESTED_CODES} />);

    const chevronBtn = screen.getByRole('button', { name: /Vis underkoder for Code A/ });
    await user.click(chevronBtn);
    await user.click(screen.getByRole('button', { name: /Skjul underkoder for Code A/ }));

    expect(screen.queryByRole('button', { name: /Velg kode A1/ })).not.toBeInTheDocument();
  });

  it('renders deeply nested children at the correct depth when expanded', async () => {
    const user = userEvent.setup();
    const deepCodes: KlassCode[] = [
      makeCode({ code: 'A', level: '1' }),
      makeCode({ code: 'A1', level: '2', parentCode: 'A', name: 'Child A1' }),
      makeCode({ code: 'A1a', level: '3', parentCode: 'A1', name: 'Grandchild A1a' }),
    ];
    render(<CodeTree codes={deepCodes} />);

    await user.click(screen.getByRole('button', { name: 'Åpne alle' }));

    expect(screen.getByRole('button', { name: /Velg kode A1a/ })).toBeInTheDocument();
  });
});
