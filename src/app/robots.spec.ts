import { afterEach, describe, expect, it, vi } from 'vitest';
import robots from './robots';

describe('robots', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it('disallows test routes', () => {
    expect(robots().rules).toEqual(
      expect.objectContaining({
        disallow: ['/test/'],
      }),
    );
  });
  it('falls back to production URL when SITE_URL is not set', () => {
    vi.stubEnv('SITE_URL', undefined);
    expect(robots().sitemap).toBe('https://dataportal.ssb.no/sitemap.xml');
  });
});
