import type { MetadataRoute } from 'next';

const siteUrl = process.env.SITE_URL ?? 'https://dataportal.ssb.no';

export default function sitemap(): MetadataRoute.Sitemap {
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
