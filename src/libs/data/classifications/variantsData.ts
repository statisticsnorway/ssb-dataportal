'use server';

import { VariantsApi, VariantsLanguageEnum } from '@/libs/data-access/klass/apis/VariantsApi';
import {
  ClassificationVariantResource,
  ClassificationVariantResourceFromJSONTyped,
} from '@/libs/data-access/klass/models';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import versionsMock from '@/static-data/versions.json';
import { getUserAgent } from '@/utils/userAgent';
import { fetchClassificationById } from './classificationData';
import { fetchVersionById } from './versionsData';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

function getVariantsClient(): VariantsApi {
  const config: ConfigurationParameters = {
    headers: { 'User-Agent': getUserAgent() },
  };
  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (klassBasePath) config.basePath = new URL(klassBasePath).origin;
  return new VariantsApi(new Configuration(config));
}

export async function fetchVariantById(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<ClassificationVariantResource | undefined> {
  const logger = createLogger('classification-variants-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    const version = versionsMock.versions.find((item) =>
      item.classificationVariants?.some((variant) => variant.id === id),
    );
    const variant = version?.classificationVariants?.find((item) => item.id === id);
    if (!version || !variant) return undefined;
    return ClassificationVariantResourceFromJSONTyped(
      { ...variant, levels: version.levels, classificationItems: version.classificationItems },
      true,
    );
  }

  try {
    return await getVariantsClient().variants({ id, language: language?.toUpperCase() as VariantsLanguageEnum }, {
      cache: 'force-cache',
      next: { revalidate: ttlSeconds },
    } as RequestInit);
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      if (error.response.status === 404) {
        logger.info({ id }, 'Variant not found');
        return undefined;
      }

      logger.error({ statusCode: error.response.status, id }, 'Variant fetch by ID failed');
    } else {
      logger.error({ error: String(error), id }, 'Unexpected error during variant fetch');
    }
    throw error;
  }
}

export async function fetchVariantForClassification(
  classificationId: number,
  variantId: number,
  language: SupportedLanguage = 'nb',
  versionId?: number,
): Promise<ClassificationVariantResource | undefined> {
  const classification = await fetchClassificationById(classificationId, language);
  const versions = classification.versions ?? [];
  const selectedVersion =
    versionId === undefined
      ? [...versions].sort((a, b) => (b.validFrom?.getTime() ?? 0) - (a.validFrom?.getTime() ?? 0))[0]
      : versions.find((version) => version.id === versionId);

  if (selectedVersion?.id === undefined) return undefined;

  const version = await fetchVersionById(selectedVersion.id, language);
  const belongsToVersion = version?.classificationVariants?.some((variant) => variant.id === variantId) ?? false;
  if (!belongsToVersion) return undefined;

  return fetchVariantById(variantId, language);
}
