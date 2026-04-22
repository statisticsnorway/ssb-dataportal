import { ReactNode } from 'react';

export interface Item {
  label: string;
  value?: string | string[] | null | ReactNode;
  display?: string | string[];
}
