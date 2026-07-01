import { localization } from '@/libs/language';

enum Tabs {
  Codes,
  About,
  Changes,
  AllVersions,
  Correspondences,
  Variants,
}

export type ClassificationDetailsTabData = { label: string; id: string; slug: string };

export const classificationDetailsTabsData: Record<keyof typeof Tabs, ClassificationDetailsTabData> = {
  Codes: {
    label: localization.classificationDetails.codes,
    id: 'codesTab',
    slug: 'codes',
  },
  About: {
    label: localization.classificationDetails.about,
    id: 'aboutTab',
    slug: 'about',
  },
  Changes: {
    label: localization.classificationDetails.changes,
    id: 'changesTab',
    slug: 'changes',
  },
  AllVersions: {
    label: localization.classificationDetails.allVersions,
    id: 'allVersionsTab',
    slug: 'all-versions',
  },
  Correspondences: {
    label: localization.classificationDetails.correspondences,
    id: 'correspondencesTab',
    slug: 'correspondences',
  },
  Variants: {
    label: localization.classificationDetails.variants,
    id: 'variantsTab',
    slug: 'variants',
  },
};

export function getClassificationDetailsTabForRoute(pathname: string): ClassificationDetailsTabData | undefined {
  return Object.values(classificationDetailsTabsData).find((tabData: ClassificationDetailsTabData) =>
    pathname.endsWith(`/${tabData.slug}`),
  );
}
