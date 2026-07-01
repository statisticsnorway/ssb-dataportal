export const CLASSIFICATION_TYPE_CATEGORY = 'classificationType';

export enum ClassificationType {
  Klassifikasjon = 'Klassifikasjon',
  Kodeverk = 'Kodeverk',
  Kodeliste = 'Kodeliste',
}

export type Subscriber = {
  email: string;
  classificationId: number | undefined;
};

export type SubscribeResult = {
  code: 'STATUS_CREATED' | 'STATUS_EXISTS';
  message: string;
  dataColor: string;
};
