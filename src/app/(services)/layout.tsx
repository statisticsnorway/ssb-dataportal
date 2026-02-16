'use client';

import { Field, Label, Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { localization } from '@/libs/language';
import styles from './search-layout.module.css';
import { getTabForRoute, tabsData } from './tabs';

export default function SearchLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = getTabForRoute(pathname) ?? tabsData.VariableDefinitions;

  return (
    <Tabs className={styles.tabsContainer} value={activeTab.id} data-color='accent'>
      <section className={styles.searchPageWrapper}>
        <div data-axe-ignore>
          <div className={`${styles.searchFieldContent} container`}>
            <Field>
              <Label
                className={styles.searchLabel}
              >{`${localization.search.searchDataportal} (${localization.info.comingSoon})`}</Label>
              <Search id='searchId' data-color='accent' aria-disabled>
                <Search.Input id='searchValue' aria-label={localization.search.label} />
                <Search.Clear />
                <Search.Button>Søk</Search.Button>
              </Search>
            </Field>
          </div>
        </div>

        <nav className={`${styles.tabsNavigationContainer} container`}>
          <Tabs.List className={styles.tabsNavigation}>
            {Object.values(tabsData).map((tab) => (
              <Tabs.Tab
                key={tab.id}
                value={tab.id}
                className={`${styles.tab} font-roboto`}
                onClick={() => router.push(tab.route)}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </nav>
      </section>

      {children}
    </Tabs>
  );
}
