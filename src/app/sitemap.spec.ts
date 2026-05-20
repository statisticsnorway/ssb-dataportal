import { describe, expect, it, vi } from 'vitest';

describe('sitemap', () => {
  it('returns public Dataportal routes', async () => {
    vi.stubEnv('SITE_URL', 'https://dataportal.test.ssb.no');

    const { default: sitemap } = await import('./sitemap');

    const result = sitemap();

    expect(result).toHaveLength(4);

    expect(result.map((entry) => entry.url)).toEqual([
      'https://dataportal.test.ssb.no',
      'https://dataportal.test.ssb.no/variable-definitions',
      'https://dataportal.test.ssb.no/classifications',
      'https://dataportal.test.ssb.no/data-products',
    ]);

    expect(result).not.toContainEqual(
      expect.objectContaining({
        url: expect.stringContaining('/test/error'),
      }),
    );

    vi.unstubAllEnvs();
  });
});
