/**
 * Represents a subscriber to a classification.
 */
export type Subscriber = {
  email: string;
  classificationId: number | undefined;
};

/**
 * Represents the result of a subscription attempt.
 */
export type SubscribeResult = {
  code: SubscribeStatus;
  message: string;
  dataColor: string;
};

/**
 * Represents the status of a subscription attempt.
 */
export enum SubscribeStatus {
  Created = 'STATUS_CREATED',
  Exists = 'STATUS_EXISTS',
  InvalidEmail = 'STATUS_INVALID_EMAIL',
  Error = 'STATUS_ERROR',
}

/**
 * Represents the colors used for validation messages.
 */
export enum ValidationMessageColors {
  Danger = 'danger',
  Success = 'success',
  Warning = 'warning',
  Info = 'info',
}
