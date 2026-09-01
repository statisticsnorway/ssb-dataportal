import { ReactNode } from 'react';

export enum Visibility {
  INTERNAL,
  EXTERNAL,
}

export interface Item {
  label: string;
  value?: ReactNode;
  popover?: boolean;
  visibility?: Set<Visibility>;
}

export interface VersionItem {
  label: string;
  value?: ReactNode | string | number | boolean | null | Date;
}
