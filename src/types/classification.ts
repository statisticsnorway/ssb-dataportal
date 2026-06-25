export const CLASSIFICATION_TYPE_CATEGORY = 'classificationType';

export enum ClassificationType {
  Klassifikasjon = 'Klassifikasjon',
  Kodeverk = 'Kodeverk',
  Kodeliste = 'Kodeliste',
}

export interface RawClassificationSummary {
  name: string;
  id: number;
  classificationType: string;
  lastModified: string; // JSON has string
  _links: { self: { href: string } };
}

export interface RawClassificationFamily {
  name: string;
  id: number;
  numberOfClassifications: number;
  classifications: RawClassificationSummary[];
  _links: { self: { href: string } };
}
