import { ReactNode } from 'react';

export type FieldType = 'text' | 'link' | 'tags';

export interface Item {
  label: string;
  value?: string | string[] | null | ReactNode;
  type?: FieldType;
  display?: string | string[];
}
