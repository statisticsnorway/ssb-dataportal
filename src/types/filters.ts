export interface FilterGroup {
  filterHeading: string;
  filters: FilterItem[];
  selectedItems: FilterItem[];
  onFilterChange: (selected: FilterItem[]) => void;
}
export interface FilterItem {
  name: string | undefined;
  code: string;
}
