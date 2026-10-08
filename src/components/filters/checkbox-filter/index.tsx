import { Checkbox, Fieldset, FieldsetLegend } from '@digdir/designsystemet-react';
import { Fragment, type ReactNode } from 'react';
import { FilterItem } from '@/types/filters';
import { CollapsibleCard } from '../collapsible-card';
import styles from './checkbox.module.css';

interface CheckboxItemsProps {
  filters: FilterItem[];
  selectedItems: FilterItem[];
  onFilterChange: (filter: FilterItem) => void;
  nestedContentByValue?: Readonly<Record<string, ReactNode>>;
}

interface CheckboxFilterProps extends CheckboxItemsProps {
  filterHeading: string;
  headingWeight?: 'regular' | 'medium' | 'semibold';
}

interface NestedCheckboxFilterProps {
  filterHeading: string;
  filters: FilterItem[];
  selectedItems: FilterItem[];
  onFilterChange: (filter: FilterItem) => void;
  visuallyHideHeading?: boolean;
}

const CheckboxItems = ({ filters, selectedItems, onFilterChange, nestedContentByValue }: CheckboxItemsProps) => {
  return filters.map((filter, index) => {
    const labelText = filter.count == null ? (filter.label ?? '') : `${filter.label ?? ''} (${filter.count})`;
    const nestedContent = nestedContentByValue?.[filter.value];

    return (
      <Fragment key={filter.value}>
        <Checkbox
          id={`checkbox-${filter.value.replace(/\s+/g, '-').toLowerCase()}-${index}`}
          label={labelText}
          className={styles.checkbox}
          checked={selectedItems.some((item) => item.value === filter.value)}
          onChange={() => onFilterChange(filter)}
        />
        {nestedContent && <div className={styles.nestedFilter}>{nestedContent}</div>}
      </Fragment>
    );
  });
};

/**
 * CheckboxFilter component renders a collapsible card containing a group of checkboxes.
 *
 * Each checkbox represents a filter option, and users can select multiple items.
 *
 * @param filterHeading - Title for the filter group.
 * @param filters - Array of available filter options, each with `value`, `label` and optional `count`.
 * @param selectedItems - Array of currently selected filter items.
 * @param onFilterChange - Callback fired when selection changes. Receives the changed `FilterItem`.
 * @param headingWeight - Controls the font weight of the filter heading. Defaults to `semibold`.
 * @param nestedContentByValue - Maps filter values to optional content rendered directly below the corresponding filter option.
 *
 * @returns A Card collapsible card component with checkboxes for filtering.
 */
export const CheckboxFilter = ({
  filterHeading,
  filters,
  selectedItems,
  onFilterChange,
  headingWeight = 'semibold',
  nestedContentByValue,
}: CheckboxFilterProps) => {
  return (
    <CollapsibleCard
      heading={filterHeading}
      toggleButtonClassName={headingWeight === 'semibold' ? styles.headingSemibold : ''}
      contentClassName={styles.checkboxFilterItems}
    >
      <CheckboxItems
        filters={filters}
        selectedItems={selectedItems}
        onFilterChange={onFilterChange}
        nestedContentByValue={nestedContentByValue}
      />
    </CollapsibleCard>
  );
};

/**
 * Renders a plain checkbox group intended for use inside another filter.
 *
 * @param filterHeading - Accessible label for the nested filter group.
 * @param filters - Array of available filter options.
 * @param selectedItems - Array of currently selected filter items.
 * @param onFilterChange - Callback fired when selection changes.
 * @param visuallyHideHeading - Visually hides the heading while keeping it available to assistive technology.
 */
export const NestedCheckboxFilter = ({
  filterHeading,
  filters,
  selectedItems,
  onFilterChange,
  visuallyHideHeading = false,
}: NestedCheckboxFilterProps) => {
  return (
    <Fieldset className={styles.nestedCheckboxFilter}>
      <FieldsetLegend className={visuallyHideHeading ? 'ds-sr-only' : styles.nestedCheckboxFilterHeading}>
        {filterHeading}
      </FieldsetLegend>
      <div className={styles.nestedCheckboxFilterItems}>
        <CheckboxItems filters={filters} selectedItems={selectedItems} onFilterChange={onFilterChange} />
      </div>
    </Fieldset>
  );
};
