import { createContext, ReactNode } from 'react';

/**
 * Lets the search page place the active filter tags inside the filters panel (desktop sidebar).
 */
export const FilterTagsSlotContext = createContext<ReactNode>(null);
