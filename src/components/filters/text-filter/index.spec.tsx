import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextFilter } from './index';

describe('TextFilter', () => {
  it('is flat and collapsed by default', () => {
    const { container } = render(<TextFilter label='Filtrer på navn' searchTerm='' setSearchTerm={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Filtrer på navn' })).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('[class*="flatFilterCard"]')).toBeInTheDocument();
  });
});
