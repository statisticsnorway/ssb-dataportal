'use server';

import {
  CorrespondenceMapResource,
  CorrespondenceTableResource,
  CorrespondenceTableResourceFromJSONTyped,
  CorrespondenceTablesApi,
  CorrespondenceTablesLanguageEnum,
  CorrespondenceTablesRequest,
} from '@/libs/data-access/klass';
import { Configuration, ConfigurationParameters, ResponseError } from '@/libs/data-access/klass/runtime';
import { SupportedLanguage } from '@/libs/language';
import { sanitizeError } from '@/libs/logger/sanitize';
import { createLogger } from '@/libs/logger/server-logger';
import versionsMock from '@/static-data/versions.json';
import { getUserAgent } from '@/utils/userAgent';
import { querystringFormatDates } from './utils';

const ttlSeconds = Number(process.env.KLASS_CACHE_TTL_SECONDS);
const logger = createLogger('classification-correspondences-data');
const FILE_DOWNLOAD_ACCEPT = {
  csv: 'text/csv',
  xml: 'application/xml',
  json: 'application/json',
} as const;
const DEFAULT_TEXT_CHARSET = 'utf-8';

type CorrespondenceDownloadFormat = keyof typeof FILE_DOWNLOAD_ACCEPT;

interface CorrespondenceDownloadRequest {
  tableId: number;
  language: SupportedLanguage;
  format: CorrespondenceDownloadFormat;
  /**
   * Swap source and target. Mirrors what KLASS itself does for `correspondsAt?inverted=true`,
   * which the stored-table endpoint does not support, so we build the file locally.
   * Only supported for csv, because the json/xml payloads also carry the table's own
   * source/target metadata, which would contradict the swapped rows.
   */
  inverted?: boolean;
}

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

/**
 * Reproduces the csv KLASS returns for `/correspondencetables/{id}`:
 * four semicolon-separated, always-quoted columns.
 */
function toCorrespondenceCsv(maps: CorrespondenceMapResource[], inverted: boolean): string {
  const header = ['sourceCode', 'sourceName', 'targetCode', 'targetName'].map(escapeCsv).join(';');

  const rows = maps.map((map) =>
    [
      (inverted ? map.targetCode : map.sourceCode) ?? '',
      (inverted ? map.targetName : map.sourceName) ?? '',
      (inverted ? map.sourceCode : map.targetCode) ?? '',
      (inverted ? map.sourceName : map.targetName) ?? '',
    ]
      .map(escapeCsv)
      .join(';'),
  );

  return [header, ...rows].join('\n');
}

function buildKlassClientConfig(): ConfigurationParameters {
  const config: ConfigurationParameters = {
    headers: {
      'User-Agent': getUserAgent(),
    },
    queryParamsStringify: querystringFormatDates,
  };
  const klassBasePath = process.env.KLASS_BASE_PATH;
  if (klassBasePath) {
    config.basePath = new URL(klassBasePath).origin;
  }
  return config;
}

function getCorrespondenceTablesClient(): CorrespondenceTablesApi {
  return new CorrespondenceTablesApi(new Configuration(buildKlassClientConfig()));
}

const fetchInit = {
  cache: 'force-cache',
  next: { revalidate: ttlSeconds },
} as RequestInit;

function toKlassLanguage(language: SupportedLanguage): 'NB' | 'NN' | 'EN' {
  return language.toUpperCase() as 'NB' | 'NN' | 'EN';
}

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

export async function fetchCorrespondenceTable(
  id: number,
  language: SupportedLanguage = 'nb',
): Promise<CorrespondenceTableResource | undefined> {
  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    const table = versionsMock.versions
      .flatMap((version) => version.correspondenceTables ?? [])
      .find((correspondence) => correspondence.id === id);

    return table ? CorrespondenceTableResourceFromJSONTyped(table, true) : undefined;
  }

  const api = getCorrespondenceTablesClient();
  try {
    return await api.correspondenceTables(
      {
        id,
        language: toKlassLanguage(language) as CorrespondenceTablesLanguageEnum,
      },
      fetchInit,
    );
  } catch (error: unknown) {
    if (error instanceof ResponseError) {
      if (error.response.status === 404) {
        logger.info({ id }, 'Correspondence table not found');
        return undefined;
      }

      logger.error(
        {
          id,
          statusCode: error.response.status,
          url: error.response.url,
        },
        'Failed to fetch correspondence table',
      );
    } else {
      logger.error({ id, error: String(error) }, 'Unexpected error fetching correspondence table');
    }
    throw error;
  }
}

export async function fetchCorrespondenceDownload({
  tableId,
  language,
  format,
  inverted = false,
}: CorrespondenceDownloadRequest): Promise<{ content: string; mimeType: string }> {
  // The stored-table endpoint has no `inverted` parameter, so the swapped file is built
  // from the table's own mappings. The normal direction stays a byte-for-byte passthrough.
  if (inverted) {
    if (format !== 'csv') {
      throw new Error(`Inverted correspondence download is only supported for csv, got "${format}"`);
    }

    const table = await fetchCorrespondenceTable(tableId, language);

    if (!table) {
      throw new Error(`Correspondence table ${tableId} not found`);
    }

    return {
      content: toCorrespondenceCsv(table.correspondenceMaps ?? [], true),
      mimeType: FILE_DOWNLOAD_ACCEPT.csv,
    };
  }

  if (process.env.KLASS_USE_STATIC_DATA === 'true') {
    logger.warn({ tableId }, 'Using static mock data for correspondence download');
    return {
      content: JSON.stringify([], null, 2),
      mimeType: FILE_DOWNLOAD_ACCEPT.json,
    };
  }

  const api = getCorrespondenceTablesClient();

  try {
    const params = {
      id: tableId,
      language: toKlassLanguage(language),
    } satisfies CorrespondenceTablesRequest;

    const response = await api.correspondenceTablesRaw(params, ({ init }) =>
      Promise.resolve({
        ...init,
        ...fetchInit,
        headers: {
          ...init.headers,
          Accept: FILE_DOWNLOAD_ACCEPT[format],
        },
      }),
    );

    const mimeType = response.raw.headers.get('content-type') ?? FILE_DOWNLOAD_ACCEPT[format];
    const buffer = await response.raw.arrayBuffer();
    const content = decodeTextResponse(buffer, mimeType);
    return { content, mimeType };
  } catch (error) {
    if (error instanceof ResponseError) {
      logger.error(
        { statusCode: error.response.status, url: error.response.url, tableId, format },
        'Failed to fetch correspondence download',
      );
    } else {
      logger.error(
        { error: sanitizeError(error), tableId, format },
        'Unexpected error fetching correspondence download',
      );
    }
    throw error;
  }
}
