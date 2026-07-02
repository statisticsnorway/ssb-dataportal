export const CLASSIFICATION_TYPE_CATEGORY = 'classificationType';

export enum ClassificationType {
  Klassifikasjon = 'Klassifikasjon',
  Kodeverk = 'Kodeverk',
  Kodeliste = 'Kodeliste',
}

// use separate file
export type Subscriber = {
  email: string;
  classificationId: number | undefined;
};

export type SubscribeResult = {
  code: SubscribeStatus;
  message: string;
  dataColor: string;
};

export enum SubscribeStatus {
  Created = 'STATUS_CREATED',
  Exists = 'STATUS_EXISTS',
  InvalidEmail = 'STATUS_INVALID_EMAIL',
  Error = 'STATUS_ERROR',
}