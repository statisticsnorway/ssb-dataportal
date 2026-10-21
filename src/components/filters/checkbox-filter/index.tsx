import { Checkbox, Fieldset, FieldsetLegend } from '@digdir/designsystemet-react';
import type { ReactNode } from 'react';
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
  variant?: 'card' | 'flat';
  defaultOpen?: boolean;
}

interface NestedCheckboxFilterProps {
  filterHeading: string;
  filters: FilterItem[];
  selectedItems: FilterItem[];
  onFilterChange: (filter: FilterItem) => void;
  visuallyHideHeading?: boolean;
}

interface CheckboxItemProps {
  filter: FilterItem;
  index: number;
  isSelected: boolean;
  nestedContent?: ReactNode;
  onFilterChange: (filter: FilterItem) => void;
}

const CheckboxItem = ({ filter, index, isSelected, nestedContent, onFilterChange }: CheckboxItemProps) => {
  const filterLabel = filter.label ?? '';
  const labelText = filter.count == null ? filterLabel : `${filterLabel} (${filter.count})`;

  return (
    <div className={styles.checkboxItem}>
      <Checkbox
        id={`checkbox-${filter.value.replace(/\s+/g, '-').toLowerCase()}-${index}`}
        label={labelText}
        className={styles.checkbox}
        checked={isSelected}
        onChange={() => onFilterChange(filter)}
      />
      {nestedContent != null && isSelected && <div className={styles.nestedFilter}>{nestedContent}</div>}
    </div>
  );
};

const CheckboxItems = ({ filters, selectedItems, onFilterChange, nestedContentByValue }: CheckboxItemsProps) => {
  return filters.map((filter, index) => (
    <CheckboxItem
      key={filter.value}
      filter={filter}
      index={index}
      isSelected={selectedItems.some((item) => item.value === filter.value)}
      nestedContent={nestedContentByValue?.[filter.value]}
      onFilterChange={onFilterChange}
    />
  ));
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
 * @param nestedContentByValue - Maps filter values to optional collapsible content rendered below the corresponding option.
 * @param variant - Controls whether the filter is presented as a card or a flat section. Defaults to `flat`.
 * @param defaultOpen - Whether the filter section is initially expanded. Defaults to `false`.
 *
 * @returns A collapsible filter with checkboxes.
 */
export const CheckboxFilter = ({
  filterHeading,
  filters,
  selectedItems,
  onFilterChange,
  nestedContentByValue,
  variant = 'flat',
  defaultOpen = false,
}: CheckboxFilterProps) => {
  return (
    <CollapsibleCard
      heading={filterHeading}
      variant={variant}
      defaultOpen={defaultOpen}
      toggleButtonClassName={styles.headingSemibold}
      contentClassName={`${styles.checkboxFilterItems} ${variant === 'flat' ? styles.flatCheckboxFilterItems : ''}`}
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

/** Renders a plain checkbox group intended for use inside another filter. */
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
