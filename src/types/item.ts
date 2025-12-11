export type FieldType = 'text' | 'longtext' | 'link' | 'tags';

export interface Item {
  label: string;
  value: string;
  type?: FieldType;
  display?: string | string[];
}
