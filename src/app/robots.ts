import type { MetadataRoute } from 'next';

const siteUrl = process.env.SITE_URL ?? 'https://dataportal.ssb.no';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/test/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
