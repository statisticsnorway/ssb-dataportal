import { Heading } from '@digdir/designsystemet-react';
import { CheckboxFilter } from '@/components/filter';
import { FilterGroup } from '@/types/filters';

const FILTER_HEADING = 'Filter';

const FiltersPanel = ({ filterGroups }: { filterGroups: FilterGroup[] }) => {
  console.log(`Selected filteres filterspanel ${filterGroups.selectedItems}`);
  return (
    <>
      <Heading level={3} data-size='sm'>
        {filterGroups.length > 0 ? FILTER_HEADING : null}
      </Heading>
      {filterGroups.map(({ filterHeading, filters, selectedItems, onFilterChange }) => (
        <CheckboxFilter
          filterHeading={filterHeading}
          key={filterHeading}
          filters={filters}
          selectedItems={selectedItems}
          onFilterChange={onFilterChange}
        />
      ))}
    </>
  );
};

export { FiltersPanel };
