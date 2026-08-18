import type { MetadataRoute } from 'next';
import { buildUrl } from './(details)/classifications/utils/urls';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL ?? 'https://dataportal.ssb.no';
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/variable-definitions`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}${buildUrl({})}`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/data-products`,
      lastModified: new Date(),
    },
  ];
}
