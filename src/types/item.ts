import { ReactNode } from 'react';

export interface Item {
  label: string;
  value?: ReactNode;
  popover?: boolean;
  isLocalized?: boolean;
}

export interface VersionItem {
  label: string;
  value?: ReactNode | string | number | boolean | null | Date;
}
