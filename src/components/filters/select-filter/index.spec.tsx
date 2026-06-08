import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectFilter } from './index';

describe('SelectFilter', () => {
  it('renders a default option and filter options with counts', () => {
    render(
      <SelectFilter
        filterHeading='Statistikkområde'
        filters={[
          { label: 'Arbeid og lønn', value: 'al', count: 2 },
          { label: 'Bank og finansmarked', value: 'bf' },
        ]}
        selectedValue=''
        defaultOptionLabel='Alle statistikkområder'
        onFilterChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('group', { name: /Statistikkområde/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Statistikkområde' })).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Alle statistikkområder' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Arbeid og lønn (2)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bank og finansmarked' })).toBeInTheDocument();
  });

  it('calls onFilterChange with the selected value', () => {
    const onFilterChange = vi.fn();
    render(
      <SelectFilter
        filterHeading='Statistikkområde'
        filters={[{ label: 'Arbeid og lønn', value: 'al', count: 2 }]}
        selectedValue=''
        defaultOptionLabel='Alle statistikkområder'
        onFilterChange={onFilterChange}
      />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Statistikkområde' }), { target: { value: 'al' } });

    expect(onFilterChange).toHaveBeenCalledWith('al');
  });
});
