import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { localization } from '@/libs/language';
import { DatasetFilters, type FilterState, type TimelinePeriodSlot } from './datasetFilters';

const periods: TimelinePeriodSlot[] = [
  { year: 2024, label: 'H1', start: '2024-01-01', end: '2024-06-30' },
  { year: 2024, label: 'H2', start: '2024-07-01', end: '2024-12-31' },
];

function Harness({ initial }: Readonly<{ initial: FilterState }>) {
  const [filters, setFilters] = useState(initial);
  return (
    <DatasetFilters
      filters={filters}
      timelinePeriods={periods}
      onChange={(updates) => setFilters((current) => ({ ...current, ...updates }))}
      content={{ showFilters: true, timeline: <p>{JSON.stringify(filters)}</p>, variables: null }}
    />
  );
}

describe('DatasetFilters accessibility', () => {
  it('moves focus to the persistent search control after resetting filters', () => {
    render(<Harness initial={{ search: 'person', period: null }} />);
    const reset = screen.getByRole('button', { name: localization.datasetDetail.resetFilters });
    reset.focus();
    fireEvent.click(reset);
    expect(screen.getByRole('button', { name: localization.search.textFilter.label })).toHaveFocus();
    expect(screen.queryByRole('button', { name: localization.datasetDetail.resetFilters })).not.toBeInTheDocument();
  });

  it('supports period selection with dropdowns and restores focus after removing it', () => {
    render(<Harness initial={{ search: '', period: null }} />);
    const periodToggle = screen.getByRole('button', { name: new RegExp(`^${localization.datasetDetail.period}$`) });
    fireEvent.click(periodToggle);
    const from = screen.getByLabelText(localization.datasetDetail.periodFrom);
    const to = screen.getByLabelText(localization.datasetDetail.periodTo);
    fireEvent.change(from, { target: { value: '1' } });
    expect(from).toHaveValue('1');
    expect(to).toHaveValue('1');
    expect(within(to).getByRole('option', { name: 'H1 2024', hidden: true })).toBeDisabled();
    const remove = screen.getByRole('button', {
      name: `${localization.filterTag.remove} ${localization.datasetDetail.period}: H2 2024`,
    });
    remove.focus();
    fireEvent.click(remove);
    expect(periodToggle).toHaveFocus();
    expect(from).toHaveValue('0');
  });
});
