export type FilterType = 'status' | 'published';

export interface FilterGroup {
  filterHeading: string;
  filters: FilterItem[];
  selectedItems: FilterItem[];
  onFilterChange: (selected: FilterItem[]) => void;
}
export interface FilterItem {
  label: string | undefined;
  value: string;
  count?: number;
}
