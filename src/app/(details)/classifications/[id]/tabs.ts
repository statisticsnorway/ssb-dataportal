import { localization } from '@/libs/language';

enum Tabs {
  Codes,
  Details,
  Changes,
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
  Details: {
    get label() {
      return localization.classificationDetails.details;
    },
    id: 'detailsTab',
    slug: 'details',
  },
  Changes: {
    get label() {
      return localization.classificationDetails.changes;
    },
    id: 'changesTab',
    slug: 'changes',
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
