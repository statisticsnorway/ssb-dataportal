export const CLASSIFICATION_TYPE_CATEGORY = 'classificationType';

export enum ClassificationType {
  Classification = 'Classification',
  Codelist = 'Codelist',
}

export const isKnownClassificationType = (value: string | undefined): value is ClassificationType => {
  return value === ClassificationType.Classification || value === ClassificationType.Codelist;
};

export const getClassificationTypeFromString = (it: string | undefined): ClassificationType | undefined => {
  switch (it) {
    case ClassificationType.Classification:
    case 'Klassifikasjon':
    case 'Classification':
    case 'Standard':
      return ClassificationType.Classification;
    case ClassificationType.Codelist:
    case 'Kodeliste':
    case 'Codelist':
      return ClassificationType.Codelist;
  }
  return undefined;
};
