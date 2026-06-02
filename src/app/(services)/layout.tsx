'use client';

import { Tabs } from '@digdir/designsystemet-react';
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
      <nav className={`${styles.tabsNavigationContainer} container`}>
        <Tabs.List aria-label={localization.tabs.ariaLabel}>
          {Object.values(tabsData).map((tab) => (
            <Tabs.Tab
              aria-controls={tab.id}
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
      {children}
    </Tabs>
  );
}
