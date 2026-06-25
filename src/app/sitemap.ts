import type { MetadataRoute } from 'next';

// fallow-ignore-next-line unused-export
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
      url: `${siteUrl}/classifications`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/data-products`,
      lastModified: new Date(),
    },
  ];
}
