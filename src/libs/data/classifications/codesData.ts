'use server';

import {
  ChangesRequest,
  CodeChangeItem,
  CodeChangeItemFromJSON,
  CodeItem,
  CodesApi,
  CodesRequest,
  VersionsLanguageEnum,
} from '@/libs/data-access/klass';
import { VersionsApi } from '@/libs/data-access/klass/apis/VersionsApi';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage, toKlassLanguage } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import changesMock from '@/static-data/classification-changes.json';
import codesMock from '@/static-data/codes-mock.json';
import type { KlassCode } from '@/types/klass-codes';
import { mapClassificationItemToKlassCode } from '@/utils/classifications/codeMappers';
import { getUserAgent } from '@/utils/userAgent';
import { querystringFormatDates } from './utils';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);
const logger = createLogger('codes-data');
const fetchInit = { cache: 'force-cache', next: { revalidate: ttlSeconds } } as RequestInit;
const FILE_DOWNLOAD_ACCEPT = {
  csv: 'text/csv',
  xml: 'application/xml',
  json: 'application/json',
} as const;

const DEFAULT_TEXT_CHARSET = 'utf-8';

export type FileDownloadFormat = keyof typeof FILE_DOWNLOAD_ACCEPT;

function getCharsetFromMimeType(mimeType: string): string {
  const match = /charset\s*=\s*['"]?([^;'"\s]+)/i.exec(mimeType);
  return match?.[1] ?? DEFAULT_TEXT_CHARSET;
}

function decodeTextResponse(buffer: ArrayBuffer, mimeType: string): string {
  const charset = getCharsetFromMimeType(mimeType);

  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder(DEFAULT_TEXT_CHARSET).decode(buffer);
  }
}

function toDateString(value?: Date): string {
  if (!value) return '';
  return value.toISOString().slice(0, 10);
}

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function toCodesCsv(codes: CodeItem[]): string {
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
      code.presentationName ?? '',
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

interface CodesDownloadRequest {
  versionId: number;
  classificationId: number;
  from: Date;
  to?: Date;
  language: SupportedLanguage;
  format: FileDownloadFormat;
}

interface ChangesDownloadRequest {
  classificationId: number;
  from: Date;
  to?: Date;
  language: SupportedLanguage;
  format: FileDownloadFormat;
}

function buildKlassClientConfig(): ConfigurationParameters {
  const config: ConfigurationParameters = {
    headers: { 'User-Agent': getUserAgent() },
  };
  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (klassBasePath) {
    config.basePath = new URL(klassBasePath).origin;
    config.queryParamsStringify = querystringFormatDates;
  }
  return config;
}

function getVersionsClient(): VersionsApi {
  return new VersionsApi(new Configuration(buildKlassClientConfig()));
}

function getCodesClient(): CodesApi {
  return new CodesApi(new Configuration(buildKlassClientConfig()));
}

export async function fetchVersionCodes(
  versionId: number,
  language: VersionsLanguageEnum | undefined = VersionsLanguageEnum.NB,
): Promise<KlassCode[]> {
  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ versionId }, 'Using static mock data for version codes');
    const key = String(versionId) as keyof typeof codesMock.versionCodes;
    return (codesMock.versionCodes[key] ?? []) as KlassCode[];
  }

  const api = getVersionsClient();
  try {
    const params = { id: versionId, language: language };
    const data = await api.versions(params, fetchInit);
    const items = data.classificationItems ?? [];
    logger.info({ params, count: items.length }, 'Fetched version codes');
    return items.map(mapClassificationItemToKlassCode);
  } catch (error) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url, versionId },
        'Failed to fetch version codes',
      );
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error fetching version codes');
    }
    throw error;
  }
}

export async function fetchCodesDownload({
  versionId,
  classificationId,
  from,
  to,
  language,
  format,
}: CodesDownloadRequest): Promise<{ content: string; mimeType: string }> {
  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ versionId }, 'Using static mock data for version code download');
    const codes = await fetchVersionCodes(versionId, toKlassLanguage(language) as VersionsLanguageEnum);
    return {
      content: JSON.stringify(codes, null, 2),
      mimeType: FILE_DOWNLOAD_ACCEPT.json,
    };
  }

  const api = getCodesClient();
  try {
    const params = { id: classificationId, from, to, language: toKlassLanguage(language) } satisfies CodesRequest;
    if (format === 'csv') {
      const data = await api.codes(params, fetchInit);
      const codes = data.codes ?? [];
      return { content: toCodesCsv(codes), mimeType: FILE_DOWNLOAD_ACCEPT.csv };
    }

    const response = await api.codesRaw(params, async ({ init }) => ({
      ...init,
      ...fetchInit,
      headers: {
        ...(init.headers ?? {}),
        Accept: FILE_DOWNLOAD_ACCEPT[format],
      },
    }));
    const mimeType = response.raw.headers.get('content-type') ?? FILE_DOWNLOAD_ACCEPT[format];
    const buffer = await response.raw.arrayBuffer();
    const content = decodeTextResponse(buffer, mimeType);
    return { content, mimeType };
  } catch (error) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url, classificationId, versionId, format },
        'Failed to fetch codes download',
      );
    } else {
      logger.error(
        { error: sanitizeError(error), classificationId, versionId, format },
        'Unexpected error fetching codes download',
      );
    }
    throw error;
  }
}

export async function fetchChanges(
  classificationId: number,
  from: Date,
  to?: Date,
  language: VersionsLanguageEnum | undefined = VersionsLanguageEnum.NB,
): Promise<CodeChangeItem[]> {
  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ versionId: classificationId }, 'Using static mock data for changes');
    const key = String(classificationId) as keyof typeof changesMock;
    return (changesMock[key]?.codeChanges.map(CodeChangeItemFromJSON) ?? []) as CodeChangeItem[];
  }

  const api = getCodesClient();
  try {
    const params = { id: classificationId, from: from, to: to, language: language } satisfies ChangesRequest;
    const data = await api.changes(params, fetchInit);
    logger.info({ params, count: data.codeChanges?.length }, 'Fetched changes');
    return data.codeChanges ?? [];
  } catch (error) {
    if (error instanceof ResponseError) {
      if (error.response.status === 404) {
        logger.info({ classificationId, url: error.response.url }, 'No changes found for classification');
        return [];
      }

      logger.error(
        {
          statusCode: error.response.status,
          url: error.response.url,
          message: error.response.body,
          versionId: classificationId,
        },
        'Failed to fetch changes',
      );
    } else {
      logger.error({ error: sanitizeError(error) }, 'Unexpected error fetching changes');
    }
    throw error;
  }
}

export async function fetchChangesDownload({
  classificationId,
  from,
  to,
  language,
  format,
}: ChangesDownloadRequest): Promise<{ content: string; mimeType: string }> {
  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ classificationId }, 'Using static mock data for changes download');
    const changeLanguage = toKlassLanguage(language) as VersionsLanguageEnum;
    const changes = await fetchChanges(classificationId, from, to, changeLanguage);
    return {
      content: JSON.stringify(changes, null, 2),
      mimeType: FILE_DOWNLOAD_ACCEPT.json,
    };
  }

  const api = getCodesClient();
  try {
    const params = { id: classificationId, from, to, language: toKlassLanguage(language) } satisfies ChangesRequest;
    const response = await api.changesRaw(params, async ({ init }) => ({
      ...init,
      ...fetchInit,
      headers: {
        ...(init.headers ?? {}),
        Accept: FILE_DOWNLOAD_ACCEPT[format],
      },
    }));
    const mimeType = response.raw.headers.get('content-type') ?? FILE_DOWNLOAD_ACCEPT[format];
    const buffer = await response.raw.arrayBuffer();
    const content = decodeTextResponse(buffer, mimeType);
    return { content, mimeType };
  } catch (error) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url, classificationId, format },
        'Failed to fetch changes download',
      );
    } else {
      logger.error(
        { error: sanitizeError(error), classificationId, format },
        'Unexpected error fetching changes download',
      );
    }
    throw error;
  }
}

export async function fetchSubjectFieldFilterValues(
  language: SupportedLanguage | undefined = 'nb',
): Promise<KlassCode[]> {
  const id = process.env.SUBJECT_FIELD_CLASSIFICATION_VERSION_ID;
  if (!id) {
    throw new Error('Necessary data not provided');
  }
  return (await fetchVersionCodes(Number(id), toKlassLanguage(language) as VersionsLanguageEnum)).filter(
    (code) => code.level == '1',
  );
}
