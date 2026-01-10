export type linkObj = {
  self: {
    href: string;
  };
};

export enum ClassificationType {
  Klassifikasjon = 'Klassifikasjon',
  Kodeverk = 'Kodeverk',
  Kodeliste = 'Kodeliste',
}

export type Classification = {
  id: number;
  name: string;
  classificationType: ClassificationType;
  lastModified: string;
  _links: linkObj;
};

export type KlassApiResponse = {
  classifications: Classification[];
  pagination: {
    links: {
      next?: { href: string };
      prev?: { href: string };
      self?: { href: string };
      last?: { href: string };
      first?: { href: string };
    };
  };
  pageInfo: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
};

export type ClassificationFamily = {
  name: string;
  id: number;
  numberOfClassifications: number;
  _links: linkObj;
};

export type ClassificationFamilyResponse = {
  name: string;
  id: number;
  classifications: Classification[];
};

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
