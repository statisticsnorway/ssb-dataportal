export interface TabItem {
  value: string;
  label: string;
  searchLabel: string;
  href: string;
}

export interface SearchFieldOption {
  value: string;
  label: string;
  default?: boolean;
}

export type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';
