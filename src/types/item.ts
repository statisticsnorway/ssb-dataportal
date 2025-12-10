export type FieldType = 'text' | 'longtext' | 'link' | 'tags';

export interface Item {
  label: string;
  value: any;
  type?: FieldType;
  display?: string | string[];
}
