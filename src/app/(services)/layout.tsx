'use client';

import { Field, Label, Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { tabs } from '@/utils/constants';
import styles from './search-layout.module.css';

export default function SearchLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = tabs.find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`)) ?? tabs[0];

  return (
    <Tabs value={activeTab.value} data-color='accent'>
      <section className={styles.searchPageWrapper}>
        <div className={`${styles.searchFieldContent} container`}>
          <Field>
            <Label className={styles.searchLabel}>{activeTab.searchLabel}</Label>
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

      {children}
    </Tabs>
  );
}
