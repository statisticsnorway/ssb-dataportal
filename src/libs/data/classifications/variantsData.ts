'use server';

import type { FileDownloadFormat } from '@/libs/data/classifications/codesData';
import { VariantsApi } from '@/libs/data-access/klass/apis/VariantsApi';
import type { ClassificationItemResource } from '@/libs/data-access/klass/models';
import {
  ClassificationVariantResource,
  ClassificationVariantResourceFromJSONTyped,
} from '@/libs/data-access/klass/models';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage, toKlassLanguage } from '@/libs/language';
import { createLogger } from '@/libs/logger/server-logger';
import versionsMock from '@/static-data/versions.json';
import { getUserAgent } from '@/utils/userAgent';
import { fetchClassificationById } from './classificationData';
import { fetchVersionById } from './versionsData';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);
const VARIANT_DOWNLOAD_ACCEPT = {
  csv: 'text/csv',
  xml: 'application/xml',
  json: 'application/json',
} as const;

function toDateString(value?: Date): string {
  if (!value) return '';
  return value.toISOString().slice(0, 10);
}

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function toCodesCsv(codes: ClassificationItemResource[]): string {
  const header =
    '"code","parentCode","level","name","shortName","presentationName","validFrom","validTo","validFromInRequestedRange","validToInRequestedRange","notes"';

  const rows = codes.map((code) => {
    const validFrom = toDateString(code.validFrom);
    const validTo = toDateString(code.validTo);
    return [
      code.code ?? '',
      code.parentCode ?? '',
      code.level ?? '',
      code.name ?? '',
      code.shortName ?? '',
      '',
      validFrom,
      validTo,
      validFrom,
      validTo,
      code.notes ?? '',
    ]
      .map(escapeCsv)
      .join(',');
  });

  return [header, ...rows].join('\n');
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toCodesXml(codes: ClassificationItemResource[]): string {
  const body = codes
    .map((code) => {
      const validFrom = toDateString(code.validFrom);
      const validTo = toDateString(code.validTo);
      return `<codeItem><code>${escapeXml(code.code ?? '')}</code><parentCode>${escapeXml(code.parentCode ?? '')}</parentCode><level>${escapeXml(code.level ?? '')}</level><name>${escapeXml(code.name ?? '')}</name><shortName>${escapeXml(code.shortName ?? '')}</shortName><presentationName></presentationName><validFrom>${escapeXml(validFrom)}</validFrom><validTo>${escapeXml(validTo)}</validTo><validFromInRequestedRange>${escapeXml(validFrom)}</validFromInRequestedRange><validToInRequestedRange>${escapeXml(validTo)}</validToInRequestedRange><notes>${escapeXml(code.notes ?? '')}</notes></codeItem>`;
    })
    .join('');

  return `<codeList>${body}</codeList>`;
}

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
    return await getVariantsClient().variants({ id, language: toKlassLanguage(language) }, {
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

export async function fetchVariantCodesDownload({
  variantId,
  language,
  format,
}: {
  variantId: number;
  language: SupportedLanguage;
  format: FileDownloadFormat;
}): Promise<{ content: string; mimeType: string }> {
  const logger = createLogger('classification-variants-data');

  try {
    const variant = await fetchVariantById(variantId, language);
    const codes = variant?.classificationItems ?? [];

    if (format === 'json') {
      return {
        content: JSON.stringify({ codes }, null, 2),
        mimeType: VARIANT_DOWNLOAD_ACCEPT.json,
      };
    }

    if (format === 'xml') {
      return {
        content: toCodesXml(codes),
        mimeType: VARIANT_DOWNLOAD_ACCEPT.xml,
      };
    }

    return {
      content: toCodesCsv(codes),
      mimeType: VARIANT_DOWNLOAD_ACCEPT.csv,
    };
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      logger.error({ statusCode: error.response.status, variantId }, 'Variant codes download failed');
    } else {
      logger.error({ error: String(error), variantId }, 'Unexpected error during variant codes download');
    }
    throw error;
  }
}
