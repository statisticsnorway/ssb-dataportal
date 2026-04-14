import { ResponseError } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language/src/localization';

/**
 * Maps an error to a user-friendly error message.
 *
 * @param error - The error to map.
 * @returns A user-friendly error message.
 */
export const mapErrorMessage = (error: Error): string => {
  if (error instanceof ResponseError) {
    switch (error.response.status) {
      case 401:
      case 403:
      case 404:
        return localization.error.unauthorized;
      case 500:
      default:
        return localization.error.somethingWentWrong;
    }
  }
  return localization.error.somethingWentWrong;
};

export const isErrorPreviewEnabled = () =>
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_TEST_ROUTES === 'true';
