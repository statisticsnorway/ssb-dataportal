import { describe, expect, it, vi } from 'vitest';

describe('robots', () => {
  it('allows public pages and disallows test routes', async () => {
    vi.stubEnv('SITE_URL', 'https://dataportal.test.ssb.no');

    const { default: robots } = await import('./robots');

    expect(robots()).toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/test/'],
      },
      sitemap: 'https://dataportal.test.ssb.no/sitemap.xml',
    });

    vi.unstubAllEnvs();
  });
});
