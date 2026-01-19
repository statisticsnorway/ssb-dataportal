import { Dropdown } from '@digdir/designsystemet-react';
import { FunnelIcon } from '@navikt/aksel-icons';
import { CheckboxFilter } from '../checkbox-filter';

const FilterDropdown = ({ filterGroups }) => {
  return (
    <Dropdown.TriggerContext>
      <Dropdown.Trigger>
        <FunnelIcon />
        Filter
      </Dropdown.Trigger>
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
