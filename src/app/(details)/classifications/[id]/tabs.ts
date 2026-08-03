import { localization } from '@/libs/language';

enum Tabs {
  Codes,
  About,
  Changes,
  Versions,
  Correspondences,
  Variants,
}

export type ClassificationDetailsTabData = { label: string; id: string; slug: string };

export const classificationDetailsTabsData: Record<keyof typeof Tabs, ClassificationDetailsTabData> = {
  Codes: {
    get label() {
      return localization.classificationDetails.codes;
    },
    id: 'codesTab',
    slug: 'codes',
  },
  About: {
    get label() {
      return localization.classificationDetails.about;
    },
    id: 'aboutTab',
    slug: 'about',
  },
  Changes: {
    get label() {
      return localization.classificationDetails.changes;
    },
    id: 'changesTab',
    slug: 'changes',
  },
  Versions: {
    get label() {
      return localization.classificationDetails.versions;
    },
    id: 'versionsTab',
    slug: 'versions',
  },
  Correspondences: {
    get label() {
      return localization.classificationDetails.correspondences;
    },
    id: 'correspondencesTab',
    slug: 'correspondences',
  },
  Variants: {
    get label() {
      return localization.classificationDetails.variants;
    },
    id: 'variantsTab',
    slug: 'variants',
  },
};

export function getClassificationDetailsTabForRoute(pathname: string): ClassificationDetailsTabData | undefined {
  return Object.values(classificationDetailsTabsData).find((tabData: ClassificationDetailsTabData) =>
    pathname.endsWith(`/${tabData.slug}`),
  );
}
