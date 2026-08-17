import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildUrl } from './(details)/classifications/utils/urls';
import sitemap from './sitemap';

describe('sitemap', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses SITE_URL for public Dataportal routes', () => {
    vi.stubEnv('SITE_URL', 'https://dataportal.test.ssb.no');
    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://dataportal.test.ssb.no',
      'https://dataportal.test.ssb.no/variable-definitions',
      `https://dataportal.test.ssb.no${buildUrl({})}`,
      'https://dataportal.test.ssb.no/data-products',
    ]);
  });

  it('falls back to production URL when SITE_URL is not set', () => {
    vi.stubEnv('SITE_URL', undefined);
    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://dataportal.ssb.no',
      'https://dataportal.ssb.no/variable-definitions',
      `https://dataportal.ssb.no${buildUrl({})}`,
      'https://dataportal.ssb.no/data-products',
    ]);
  });

  it('does not include test routes', () => {
    vi.stubEnv('SITE_URL', 'https://dataportal.test.ssb.no');
    expect(sitemap().map((entry) => entry.url)).not.toContain('https://dataportal.test.ssb.no/test/error/');
  });
});
