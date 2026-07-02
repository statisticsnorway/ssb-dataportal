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
  code: 'STATUS_CREATED' | 'STATUS_EXISTS' | 'STATUS_INVALID_EMAIL'  | 'STATUS_ERROR';
  message: string;
  dataColor: string;
};
