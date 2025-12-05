import { ReactNode } from 'react';

export type Item = {
  label: string;
  value: ReactNode;
  href?: string;
};
