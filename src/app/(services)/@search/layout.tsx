'use client';

import { Field, Label, Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { SearchPageSkeleton } from '@/components/search-page-wrapper/search-page-skeleton';
import { localization } from '@/libs/language/src/localization';
import styles from './search-layout.module.css';

const tabs = [
  {
    value: 'vardefTab',
    label: 'Variabeldefinisjoner',
    searchLabel: localization.search.searchForVariableDefinitions,
    href: '/variable-definitions',
  },
  {
    value: 'klassTab',
    label: 'Klassifikasjoner',
    searchLabel: localization.search.searchForClassifications,
    href: '/classifications',
  },
  {
    value: 'datasetTab',
    label: 'Datasett',
    searchLabel: localization.search.searchForDatasets,
    href: '/datasets',
  },
];

export default function SearchLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = tabs.find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`)) ?? tabs[0];

  return (
    <Tabs value={activeTab.value} data-color='accent'>
      <section className={styles.searchPageWrapper}>
        <div className={`${styles.searchFieldContent} container`}>
          <Field>
            <Label className={styles.searchLabel}>Søk i {activeTab.searchLabel.toLowerCase()}</Label>
            <Search id='searchId' data-color='accent' aria-disabled>
              <Search.Input id='searchValue' aria-label='Søk' />
              <Search.Clear />
              <Search.Button>Søk</Search.Button>
            </Search>
          </Field>
        </div>

        <div className={`${styles.tabsNavigationContainer} container`}>
          <Tabs.List className={styles.tabsNavigation}>
            {tabs.map((tab) => (
              <Tabs.Tab key={tab.value} value={tab.value} className={styles.tab} onClick={() => router.push(tab.href)}>
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </div>
      </section>

      <Suspense fallback={<SearchPageSkeleton />} key={activeTab.value}>
        {children}
      </Suspense>
    </Tabs>
  );
}
