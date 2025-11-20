'use client';

import { Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './search-page.module.css';

interface SearchPageProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  children: React.ReactNode;
}

const SearchPage: React.FC<SearchPageProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState('');

  const derivedTab = pathname.includes('/classifications')
    ? 'klassTab'
    : pathname.includes('/variable-definitions')
      ? 'vardefTab'
      : pathname.includes('/datasets') ? 'datasetTab'
      : '';

  useEffect(() => {
    if (selectedTab !== derivedTab) {
      setSelectedTab(derivedTab);
    }
  }, [derivedTab]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    if (value === 'klassTab') router.push('/classifications');
    if (value === 'vardefTab') router.push('/variable-definitions')
    else if (value === 'datasetTab') router.push('/datasets');
  };

  useEffect(() => {
    console.log(selectedTab);
  }, [selectedTab]);

  return (
    <Tabs value={selectedTab} className={styles.tabsContainer} data-color='brand1' onChange={handleTabChange}>
      <section className={styles.searchPageWrapper}>
        <div className={`${styles.searchFieldContent} container`}>
          <Search id='searchId'>
            <Search.Input id='searchValue' aria-label='Søk' />
            <Search.Clear />
            <Search.Button>Søk</Search.Button>
          </Search>
        </div>
        <div className={`${styles.tabsNavigationContainer} container`}>
          <Tabs.List className={styles.tabsNavigation}>
            <Tabs.Tab value='vardefTab' className={styles.tab}>
              Variabeldefinisjoner
            </Tabs.Tab>
            <Tabs.Tab value='klassTab' className={styles.tab}>
              Klassifikasjoner
            </Tabs.Tab>
              <Tabs.Tab value='datasetTab' className={styles.tab}>
              Datasett
            </Tabs.Tab>
          </Tabs.List>
        </div>
      </section>
      <div className={styles.tabsContentContainer}>
        <section className={styles.tabsContent}>{children}</section>
      </div>
    </Tabs>
  );
};

export default SearchPage;
