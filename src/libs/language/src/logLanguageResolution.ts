import 'server-only';
import { createLogger } from '@/libs/logger/server-logger';
import type { SupportedLanguage } from './localization';

const logger = createLogger('localization');

export function logLanguageResolution(
  value: string | undefined,
  locale: string | undefined,
  language: SupportedLanguage,
) {
  const logObject = {
    cookie: value,
    acceptLanguage: locale,
    language,
  };

  if (language === 'nn') {
    logger.warn(logObject, 'Resolved to Nynorsk');
    return;
  }

  logger.debug(logObject, 'Resolved language');
}
