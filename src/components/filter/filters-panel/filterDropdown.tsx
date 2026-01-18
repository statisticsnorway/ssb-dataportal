import { Dropdown } from '@digdir/designsystemet-react';
import { CheckboxFilter } from '@/components/filter';

const FilterDropdown = ({ filterGroups }) => {
  return (
    <Dropdown.TriggerContext>
      <Dropdown.Trigger>Filter</Dropdown.Trigger>
      <Dropdown placement='bottom-start' autoPlacement={false}>
        {(filterGroups || []).map(({ filterHeading, filters, selectedItems, onFilterChange }) => (
          <Dropdown.Item key={filterHeading}>
            <CheckboxFilter
              filterHeading={filterHeading}
              filters={filters}
              selectedItems={selectedItems}
              onFilterChange={onFilterChange}
            />
          </Dropdown.Item>
        ))}
      </Dropdown>
    </Dropdown.TriggerContext>
  );
};

export { FilterDropdown };
