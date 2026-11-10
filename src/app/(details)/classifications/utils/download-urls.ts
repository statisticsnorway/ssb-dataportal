import type { FileDownloadFormat } from '@/libs/data/classifications/codesData';
import type { SupportedLanguage } from '@/libs/language';

const DOWNLOAD_PATH_SEGMENT = 'download';
const DOWNLOAD_SCHEMA_VERSION = '1';

const FORMAT_OPTIONS = new Set<FileDownloadFormat>(['csv', 'xml', 'json']);
const LANGUAGE_OPTIONS = new Set<SupportedLanguage>(['nb', 'nn', 'en']);

export interface DownloadConfig {
  format: FileDownloadFormat;
  language: SupportedLanguage;
  level?: string;
  /** Correspondence tables only: download the mappings with source and target swapped. */
  inverted?: boolean;
}

function isFormat(value: string | null): value is FileDownloadFormat {
  if (!value) return false;
  return FORMAT_OPTIONS.has(value as FileDownloadFormat);
}

function isLanguage(value: string | null): value is SupportedLanguage {
  if (!value) return false;
  return LANGUAGE_OPTIONS.has(value as SupportedLanguage);
}

export function parseDownloadConfig(
  searchParams: Pick<URLSearchParams, 'get'>,
  defaultLanguage: SupportedLanguage,
): DownloadConfig {
  const format = searchParams.get('format');
  const language = searchParams.get('language');
  const level = searchParams.get('level')?.trim();

  return {
    format: isFormat(format) ? format : 'csv',
    language: isLanguage(language) ? language : defaultLanguage,
    level: level,
    inverted: searchParams.get('inverted') === 'true',
  };
}

export function buildDownloadQuery(config: DownloadConfig): string {
  const query = new URLSearchParams();
  query.set('v', DOWNLOAD_SCHEMA_VERSION);
  query.set('format', config.format);
  query.set('language', config.language);
  if (config.level) {
    query.set('level', config.level);
  }
  if (config.inverted) {
    query.set('inverted', 'true');
  }
  return query.toString();
}

export function buildDownloadHref(pathname: string, config: DownloadConfig): string {
  return `${getDownloadPath(getBasePathFromDownloadPath(pathname))}?${buildDownloadQuery(config)}`;
}

export function getDownloadPath(pathname: string): string {
  return pathname.endsWith(`/${DOWNLOAD_PATH_SEGMENT}`) ? pathname : `${pathname}/${DOWNLOAD_PATH_SEGMENT}`;
}

export function getBasePathFromDownloadPath(pathname: string): string {
  const suffix = `/${DOWNLOAD_PATH_SEGMENT}`;
  return pathname.endsWith(suffix) ? pathname.slice(0, -suffix.length) : pathname;
}

/** Adds or removes the `inverted` flag on an already-built download href. */
export function withInvertedParam(href: string, inverted: boolean): string {
  const [path, query = ''] = href.split('?');
  const params = new URLSearchParams(query);

  if (inverted) {
    params.set('inverted', 'true');
  } else {
    params.delete('inverted');
  }

  const nextQuery = params.toString();
  return nextQuery ? `${path}?${nextQuery}` : (path ?? href);
}
