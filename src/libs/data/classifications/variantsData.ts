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
import { FALLBACK_ORDER } from './utils';
import { fetchVersionById } from './versionsData';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);

export type VariantWithLanguage = ClassificationVariantResource & {
  /** Language actually used to populate `name`/`description`. Undefined when it matches the requested language. */
  fallbackLanguage?: SupportedLanguage;
};

/**
 * Converts a variant to the language-aware entry format.
 *
 * @param c Variant resource.
 * @param lang Language of the resource.
 * @param requested Requested language.
 * @returns Variant entry with fallback language metadata.
 */
function toEntry(
  c: ClassificationVariantResource,
  lang: SupportedLanguage,
  requested: SupportedLanguage,
): VariantWithLanguage {
  return {
    ...c,
    fallbackLanguage: lang === requested ? undefined : lang,
  };
}

function getVariantsClient(): VariantsApi {
  const config: ConfigurationParameters = {
    headers: { 'User-Agent': getUserAgent() },
  };
  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (klassBasePath) config.basePath = new URL(klassBasePath).origin;
  return new VariantsApi(new Configuration(config));
}

export async function fetchVariantForLanguage(id: number, language: SupportedLanguage | undefined = 'nb') {
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
      logger.error({ statusCode: error.response.status, id }, 'Variant fetch by ID failed');
    } else {
      logger.error({ error: String(error), id }, 'Unexpected error during variant fetch');
    }
    throw error;
  }
}

export async function fetchVariantById(
  id: number,
  language: SupportedLanguage | undefined = 'nb',
): Promise<VariantWithLanguage | undefined> {
  const logger = createLogger('classification-variants-data');

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    const version = versionsMock.versions.find((item) =>
      item.classificationVariants?.some((variant) => variant.id === id),
    );
    const variant = version?.classificationVariants?.find((item) => item.id === id);
    if (!version || !variant) return undefined;
    return toEntry(
      ClassificationVariantResourceFromJSONTyped(
        { ...variant, levels: version.levels, classificationItems: version.classificationItems },
        true,
      ),
      'nb',
      language,
    );
  }
  const languages = [language, ...FALLBACK_ORDER.filter((l) => l !== language)] as SupportedLanguage[];

  const results = await Promise.all(
    languages.map(async (lang) => {
      try {
        const resource = await fetchVariantForLanguage(id, lang);
        return resource ? toEntry(resource, lang, language) : null;
      } catch (error) {
        logger.warn({ id, lang, error: String(error) }, 'Variant fetch failed for language');
        return null;
      }
    }),
  );
  const chosen = results.find((r) => r?.name) ?? results.find((r): r is VariantWithLanguage => r !== null);
  if (!chosen) throw new Error(`Variant ${id} not available in any supported language`);

  return chosen;
}

export async function fetchVariantForClassification(
  classificationId: number,
  variantId: number,
  language: SupportedLanguage = 'nb',
  versionId?: number,
): Promise<VariantWithLanguage | undefined> {
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
