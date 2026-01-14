'use client';
import { Field, Label, Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import styles from './services-layout.module.css';

export default function ServicesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const derivedTab = pathname.includes('/classifications')
    ? 'klassTab'
    : pathname.includes('/variable-definitions')
      ? 'vardefTab'
      : pathname.includes('/datasets')
        ? 'datasetTab'
        : '';

  const [selectedTab, setSelectedTab] = useState(derivedTab);

  const tabs = [
    { value: 'vardefTab', label: 'Variabeldefinisjoner', href: '/variable-definitions' },
    { value: 'klassTab', label: 'Klassifikasjoner', href: '/classifications' },
    { value: 'datasetTab', label: 'Datasett', href: '/datasets' },
  ];

  useEffect(() => {
    setSelectedTab(derivedTab);
  }, [derivedTab]);

  // Prefetch all tabs on mount
  useEffect(() => {
    tabs.forEach((tab) => {
      router.prefetch(tab.href);
    });
  }, []);

  const handleTabChange = (value: string) => {
    const tab = tabs.find((t) => t.value === value);
    if (tab) {
      router.push(tab.href);
    }
  };

  return (
    <Tabs value={selectedTab} data-color='accent' onChange={handleTabChange}>
      <section className={styles.searchPageWrapper}>
        <div className={`${styles.searchFieldContent} container`}>
          <Field>
            <Label className={styles.searchLabel}>Søk i kodeverk</Label>
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
      {children}
    </Tabs>
  );
}
