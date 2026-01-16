'use client';

import { Field, Label, Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, Suspense, useEffect } from 'react';
import { SearchPageSkeleton } from '@/components/search-page-wrapper/search-page-skeleton';
import styles from './search-layout.module.css';

const tabs = [
  {
    value: 'vardefTab',
    label: 'Variabeldefinisjoner',
    searchWord: 'Variabeldefinisjoner',
    href: '/variable-definitions',
  },
  {
    value: 'klassTab',
    label: 'Klassifikasjoner',
    searchWord: 'Kodeverk',
    href: '/classifications',
  },
  {
    value: 'datasetTab',
    label: 'Datasett',
    searchWord: 'Datasett',
    href: '/datasets',
  },
];

export default function SearchLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = tabs.find((tab) => pathname.startsWith(tab.href)) ?? tabs[0];

  useEffect(() => {
    tabs.forEach(({ href }) => router.prefetch(href));
  }, [router]);

  return (
    <Tabs
      value={activeTab.value}
      data-color='accent'
      onChange={(value) => router.push(tabs.find((t) => t.value === value)!.href)}
    >
      <section className={styles.searchPageWrapper}>
        <div className={`${styles.searchFieldContent} container`}>
          <Field>
            <Label className={styles.searchLabel}>Søk i {activeTab.searchWord.toLowerCase()}</Label>
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
              <Tabs.Tab key={tab.value} value={tab.value} className={styles.tab}>
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
