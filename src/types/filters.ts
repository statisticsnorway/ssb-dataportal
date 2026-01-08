export type FilterType = 'status' | 'published';

export interface FilterGroup {
  filterHeading: string;
  filters: FilterItem[];
  selectedItems: string[];
  onFilterChange: (selected: string[]) => void;
}
export interface FilterItem {
  label: string | undefined;
  value: string;
}
