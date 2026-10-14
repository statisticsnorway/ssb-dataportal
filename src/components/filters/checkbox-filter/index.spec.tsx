import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxFilter } from './index';

const statisticalProduct = {
  label: 'Statistikkprodukt',
  value: 'STATISTIC_PRODUCT',
  count: 2,
};

describe('CheckboxFilter', () => {
  it('shows nested content only while the parent checkbox is selected', () => {
    const onFilterChange = vi.fn();
    const { rerender } = render(
      <CheckboxFilter
        filterHeading='Dataprodukttype'
        filters={[statisticalProduct]}
        selectedItems={[]}
        onFilterChange={onFilterChange}
        nestedContentByValue={{
          STATISTIC_PRODUCT: <div>Statistikkområder</div>,
        }}
      />,
    );

    expect(screen.queryByText('Statistikkområder')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Statistikkprodukt (2)' }));
    expect(onFilterChange).toHaveBeenCalledWith(statisticalProduct);

    rerender(
      <CheckboxFilter
        filterHeading='Dataprodukttype'
        filters={[statisticalProduct]}
        selectedItems={[statisticalProduct]}
        onFilterChange={onFilterChange}
        nestedContentByValue={{
          STATISTIC_PRODUCT: <div>Statistikkområder</div>,
        }}
      />,
    );
    expect(screen.getByText('Statistikkområder')).toBeVisible();
  });
});
