import { describe, expect, it } from 'vitest';
import {
  buildDownloadHref,
  buildDownloadQuery,
  getBasePathFromDownloadPath,
  getDownloadPath,
  parseDownloadConfig,
} from './download-urls';

describe('download url helpers', () => {
  it('parses valid format and language from query', () => {
    const params = new URLSearchParams('format=json&language=en');

    expect(parseDownloadConfig(params, 'nb')).toEqual({ format: 'json', language: 'en' });
  });

  it('falls back to defaults when query values are invalid', () => {
    const params = new URLSearchParams('format=pdf&language=de');

    expect(parseDownloadConfig(params, 'nn')).toEqual({ format: 'csv', language: 'nn' });
  });

  it('builds expected query string', () => {
    expect(buildDownloadQuery({ format: 'xml', language: 'en' })).toBe('v=1&format=xml&language=en');
  });

  it('adds and removes download path segment', () => {
    const basePath = '/classifications/2003/codes';
    const downloadPath = getDownloadPath(basePath);

    expect(downloadPath).toBe('/classifications/2003/codes/download');
    expect(getBasePathFromDownloadPath(downloadPath)).toBe(basePath);
  });

  it('builds full download href with query', () => {
    expect(buildDownloadHref('/classifications/2003/changes', { format: 'csv', language: 'nb' })).toBe(
      '/classifications/2003/changes/download?v=1&format=csv&language=nb',
    );
  });
});
