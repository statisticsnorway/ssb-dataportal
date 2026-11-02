import 'server-only';

import { cache } from 'react';
import { fetchClassificationById } from '@/libs/data/classifications/classificationData';
import { getRequestLanguage } from '@/libs/language/src/getRequestLanguage';
import { createLogger } from '@/libs/logger/server-logger';
import { resolveDefaultVersion } from '../utils/versionSelection';

export const getClassificationPageData = cache(async (id: number) => {
  const logger = createLogger('classification-detail-page');
  const language = await getRequestLanguage();
  const classification = await fetchClassificationById(id, language, true);
  logger.debug(`Fetched classification ${classification.name}`);
  return { classification, language };
});

/**
 * Resolves the version used when no version is present in the URL.
 *
 * Owns the clock so that every segment of a request resolves the same default
 * version. Callers must never call `resolveDefaultVersion` with their own
 * `new Date()`, or a render that straddles midnight can resolve two different
 * versions within one request.
 */
export const getResolvedVersion = cache(async (id: number) => {
  const { classification, language } = await getClassificationPageData(id);
  const defaultVersion = resolveDefaultVersion(classification.versions ?? [], new Date());

  return { classification, language, defaultVersion };
});
