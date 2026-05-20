import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL ?? 'https://dataportal.ssb.no';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/test/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
