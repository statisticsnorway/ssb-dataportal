export const CLASSIFICATION_TYPE_CATEGORY = 'classificationType';

export enum ClassificationType {
  Classification = 'Classification',
  Codelist = 'Codelist',
}

export const isKnownClassificationType = (value: string): value is ClassificationType => {
  return value === ClassificationType.Classification || value === ClassificationType.Codelist;
};

export const getClassificationTypeFromString = (it: string | undefined): ClassificationType | undefined => {
  switch (it) {
    case 'Klassifikasjon':
    case 'Classification':
      return ClassificationType.Classification;
    case 'Kodeliste':
    case 'Codelist':
      return ClassificationType.Codelist;
  }
  return undefined;
};
