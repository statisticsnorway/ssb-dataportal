export interface TabItem {
  label: string;
  value: string;
}

export interface SearchFieldOption {
  value: string;
  label: string;
  default?: boolean;
}

export type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';
