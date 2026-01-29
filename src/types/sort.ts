export const sortTypes = ['titleAsc', 'titleDesc', 'lastChanged'] as const;

export type SortTypes = (typeof sortTypes)[number];
