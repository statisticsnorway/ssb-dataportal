import { localization } from '@/libs/language';

enum Tabs {
  Codes,
  Details,
  Changes,
  Correspondences,
  Variants,
}

export type TabSlug = 'codes' | 'details' | 'changes' | 'correspondences' | 'variants';

export type ClassificationDetailsTabData = {
  label: string;
  id: string;
  slug: TabSlug;
  nestedRouteSegments?: readonly string[];
};

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
    nestedRouteSegments: ['correspondences'],
  },
  Variants: {
    get label() {
      return localization.classificationDetails.variants;
    },
    id: 'variantsTab',
    slug: 'variants',
    nestedRouteSegments: ['variants'],
  },
};

export function getClassificationDetailsTabForRoute(pathname: string): ClassificationDetailsTabData | undefined {
  const routePath = pathname.split('?')[0] ?? pathname;
  const routeSegments = routePath.split('/').filter(Boolean);

  const effectiveLastSegment = routeSegments.at(-1) === 'download' ? routeSegments.at(-2) : routeSegments.at(-1);

  return Object.values(classificationDetailsTabsData).find(
    (tabData: ClassificationDetailsTabData) =>
      effectiveLastSegment === tabData.slug ||
      tabData.nestedRouteSegments?.some((segment) => routeSegments.includes(segment)),
  );
}
