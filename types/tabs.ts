export interface TabItem{
    label: string;
    value: string;
}

export interface SearchFieldOption {
    value: string;
    label: string;
    default?: boolean;
}

//const sortTypes: SortTypes[] = ['titleAsc', 'titleDesc', 'lastChanged'];

export type SortTypes = 'titleAsc' | 'titleDesc' | 'lastChanged';
