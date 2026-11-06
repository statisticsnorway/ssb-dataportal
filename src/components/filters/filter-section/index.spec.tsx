import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FilterSection } from './index';

describe('FilterSection', () => {
  it('renders a titled section with its filter control', () => {
    render(
      <FilterSection title='Periode'>
        <button type='button'>Choose period</button>
      </FilterSection>,
    );

    expect(screen.getByRole('region', { name: 'Periode' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Periode', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose period' })).toBeInTheDocument();
  });
});
