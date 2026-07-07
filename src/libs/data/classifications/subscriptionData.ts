import { localization } from '@/libs/language/src/localization';
import { createLogger } from '@/libs/logger/server-logger';
import subscribersMock from '@/static-data/subscribers.json';
import { SubscribeResult, Subscriber, SubscribeStatus, ValidationMessageColors } from '@/types/subscription';
import { getUserAgent } from '@/utils/userAgent';

/**
 * Makes a POST request to the Klass API at the given path with query parameters.
 *
 * @param basePath - The resolved Klass API base path (must be a valid URL string)
 * @param path - The API endpoint path (e.g. `/api/klass/v1/classifications/1/trackChanges`)
 * @param params - Key-value pairs to append as query string parameters
 * @returns A promise that resolves to the raw `Response` object
 */
async function klassPost(basePath: string, path: string, params: Record<string, string>): Promise<Response> {
  const origin = new URL(basePath).origin;
  const url = new URL(`${origin}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  return fetch(url.toString(), {
    method: 'POST',
    headers: {
      'User-Agent': getUserAgent(),
    },
  });
}

/**
 * Subscribes a user to change notifications for a specific classification.
 *
 * When `KLASS_SUBSCRIBER_USE_STATIC_DATA` is `true`, returns a mock response based on
 * whether the email/classificationId pair already exists in the static data.
 *
 * @param subscriber - The subscriber details containing `email` and `classificationId`
 * @returns A promise that resolves to a `SubscribeResult` with a status code, message, and color
 *   - `SubscribeStatus.Created` – subscription was successfully created
 *   - `SubscribeStatus.Exists` – email is already subscribed to this classification
 *   - `SubscribeStatus.Error` – subscription failed due to a server or network error
 * @throws {Error} If an unexpected error occurs during the request
 */
export async function postSubscriber(subscriber: Subscriber): Promise<SubscribeResult> {
  const logger = createLogger('subscriber');

  if (process.env.KLASS_SUBSCRIBER_USE_STATIC_DATA === 'true') {
    logger.warn('Using static mock data for subscriber');
    const exists = subscribersMock.some(
      (s) => s.email === subscriber.email && s.classificationId === subscriber.classificationId,
    );
    if (exists) {
      return {
        code: SubscribeStatus.Exists,
        message: localization.classification.subscribeMessageAlready,
        dataColor: ValidationMessageColors.Info,
      };
    }
    return {
      code: SubscribeStatus.Created,
      message: localization.classification.subscribeMessageSuccess,
      dataColor: ValidationMessageColors.Success,
    };
  }

  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (!klassBasePath) {
    logger.error('KLASS_BASE_PATH is not configured');
    return {
      code: SubscribeStatus.Error,
      message: localization.classification.subscribeMessageError,
      dataColor: ValidationMessageColors.Danger,
    };
  }

  try {
    const res = await klassPost(
      klassBasePath,
      `/api/klass/v1/classifications/${subscriber.classificationId}/trackChanges`,
      {
        email: subscriber.email,
      },
    );

    const text = await res.text();
    logger.debug({ text, status: res.status }, 'Raw response from trackChanges');
    const body: Partial<SubscribeResult> = text ? JSON.parse(text) : {};

    if (res.status === 400 && body.code === SubscribeStatus.Exists) {
      logger.info({ classificationId: subscriber.classificationId }, 'Email already subscribed');
      return {
        code: SubscribeStatus.Exists,
        message: localization.classification.subscribeMessageAlready,
        dataColor: ValidationMessageColors.Info,
      };
    }

    if (res.status === 500) {
      logger.error({ classificationId: subscriber.classificationId }, 'Email problem during subscription');
      return {
        code: SubscribeStatus.Error,
        message: localization.classification.subscribeMessageError,
        dataColor: ValidationMessageColors.Danger,
      };
    }

    if (!res.ok) {
      logger.error({ statusCode: res.status }, 'Failed to subscribe to classification changes');
      return {
        code: SubscribeStatus.Error,
        message: localization.classification.subscribeMessageError,
        dataColor: ValidationMessageColors.Danger,
      };
    }

    logger.info({ classificationId: subscriber.classificationId }, 'Subscribed to classification changes');
    return {
      code: SubscribeStatus.Created,
      message: localization.classification.subscribeMessageSuccess,
      dataColor: ValidationMessageColors.Success,
    };
  } catch (error: unknown) {
    logger.error({ error: String(error) }, 'Unexpected error during subscription');
    throw error;
  }
}
