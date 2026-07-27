import { localization } from '@/libs/language';

enum Tabs {
  VariableDefinitions,
  Classifications,
  DataProducts,
}

export type TabData = { label: string; route: string; id: string };

export const tabsData: Record<keyof typeof Tabs, TabData> = {
  VariableDefinitions: {
    get label() {
      return localization.tabs.variableDefinitions;
    },
    route: '/variable-definitions',
    id: 'variableDefinitionsTab',
  },
  Classifications: {
    get label() {
      return localization.tabs.classifications;
    },
    route: '/classifications',
    id: 'classificationsTab',
  },
  DataProducts: {
    get label() {
      return localization.tabs.dataProducts;
    },
    route: '/data-products',
    id: 'dataProductsTab',
  },
};

export function getTabForRoute(pathname: string): TabData | undefined {
  return Object.values(tabsData).find((tabData: TabData) => pathname.includes(tabData.route));
}
