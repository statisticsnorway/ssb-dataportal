import { describe, expect, it } from 'vitest';
import {
  buildDownloadHref,
  buildDownloadQuery,
  getBasePathFromDownloadPath,
  getDownloadPath,
  parseDownloadConfig,
  withInvertedParam,
} from './download-urls';

describe('download url helpers', () => {
  it('parses valid format and language from query', () => {
    const params = new URLSearchParams('format=json&language=en&level=2');

    expect(parseDownloadConfig(params, 'nb')).toEqual({
      format: 'json',
      language: 'en',
      level: '2',
      inverted: false,
    });
  });

  it('falls back to defaults when query values are invalid', () => {
    const params = new URLSearchParams('format=pdf&language=de');

    expect(parseDownloadConfig(params, 'nn')).toEqual({
      format: 'csv',
      language: 'nn',
      level: undefined,
      inverted: false,
    });
  });

  it('builds expected query string', () => {
    expect(buildDownloadQuery({ format: 'xml', language: 'en' })).toBe('v=1&format=xml&language=en');
  });

  it('includes selected level in query string when present', () => {
    expect(buildDownloadQuery({ format: 'xml', language: 'en', level: '3' })).toBe(
      'v=1&format=xml&language=en&level=3',
    );
  });

  it('adds and removes download path segment', () => {
    const basePath = '/classifications/2003/codes';
    const downloadPath = getDownloadPath(basePath);

    expect(downloadPath).toBe('/classifications/2003/codes/download');
    expect(getBasePathFromDownloadPath(downloadPath)).toBe(basePath);
  });

  it('round-trips the inverted flag through query and parse', () => {
    const query = buildDownloadQuery({ format: 'csv', language: 'nb', inverted: true });

    expect(query).toBe('v=1&format=csv&language=nb&inverted=true');
    expect(parseDownloadConfig(new URLSearchParams(query), 'nb').inverted).toBe(true);
  });

  it('omits the inverted flag when the table is in its stored direction', () => {
    expect(buildDownloadQuery({ format: 'csv', language: 'nb', inverted: false })).toBe('v=1&format=csv&language=nb');
  });

  it('adds and removes the inverted flag on an existing href', () => {
    const href = '/classifications/2003/correspondences/1/download?v=1&format=csv&language=nb';

    const withFlag = withInvertedParam(href, true);
    expect(withFlag).toBe(`${href}&inverted=true`);
    expect(withInvertedParam(withFlag, false)).toBe(href);
  });

  it('builds full download href with query', () => {
    expect(buildDownloadHref('/classifications/2003/changes', { format: 'csv', language: 'nb' })).toBe(
      '/classifications/2003/changes/download?v=1&format=csv&language=nb',
    );
  });
});
