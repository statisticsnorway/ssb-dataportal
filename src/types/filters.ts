export interface FilterItem {
  label: string | undefined;
  value: string;
  count?: number;
  category?: string;
}

export interface FilterHelpText {
  heading: string;
  text: string;
}
