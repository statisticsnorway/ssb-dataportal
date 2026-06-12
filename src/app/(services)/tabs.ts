import { localization } from '@/libs/language';

export enum Tabs {
  VariableDefinitions,
  Classifications,
  DataProducts,
}

export type TabData = { label: string; route: string; id: string };

export const tabsData: Record<keyof typeof Tabs, TabData> = {
  VariableDefinitions: {
    label: localization.tabs.variableDefinitions,
    route: '/variable-definitions',
    id: 'variableDefinitionsTab',
  },
  Classifications: {
    label: localization.tabs.classifications,
    route: '/classifications',
    id: 'classificationsTab',
  },
  DataProducts: {
    label: localization.tabs.dataProducts,
    route: '/data-products',
    id: 'dataProductsTab',
  },
};

export function getTabForRoute(pathname: string): TabData | undefined {
  return Object.values(tabsData).find((tabData: TabData) => pathname.includes(tabData.route));
}

export function getTabForId(id: string): TabData | undefined {
  return Object.values(tabsData).find((tabData: TabData) => tabData.id == id);
}
