'use client';

import { Field, Label, Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { FiltersPanel } from '@/components/filter/filters-panel';
import { SortTypes } from '@/hooks/useSearchStateKlass';
import { FilterGroup } from '@/types/filters';
import SortFields from '../../sort-fields';
import { FilterInfoSection } from '../filterInfoSection';
import styles from './search-page.module.css';

interface SearchPageProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  infoContent?: ReactNode;
  searchResult?: ReactElement;
  filterGroups?: FilterGroup[];
  searchLabel?: string;
  sortOptions?: SortTypes[];
  sortValue?: SortTypes;
  onSortChange?: (key: string) => void;
  filterTags?: ReactNode[];
}

const SearchPage: React.FC<SearchPageProps> = ({
  infoContent,
  searchResult,
  filterGroups,
  searchLabel,
  sortOptions,
  sortValue,
  onSortChange,
  filterTags,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedTab, setSelectedTab] = useState('');

  const derivedTab = pathname.includes('/classifications')
    ? 'klassTab'
    : pathname.includes('/variable-definitions')
      ? 'vardefTab'
      : pathname.includes('/datasets')
        ? 'datasetTab'
        : '';

  const tabs = [
    { value: 'vardefTab', label: 'Variabeldefinisjoner' },
    { value: 'klassTab', label: 'Klassifikasjoner' },
    { value: 'datasetTab', label: 'Datasett' },
  ];
  useEffect(() => {
    if (selectedTab !== derivedTab) {
      setSelectedTab(derivedTab);
    }
  }, [derivedTab]);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    if (value === 'klassTab') router.push('/classifications');
    if (value === 'vardefTab') router.push('/variable-definitions');
    else if (value === 'datasetTab') router.push('/datasets');
  };

  useEffect(() => {
    console.log(selectedTab);
  }, [selectedTab]);

  return (
    <Tabs value={selectedTab} data-color='accent' onChange={handleTabChange}>
      <section className={styles.searchPageWrapper}>
        <div className={`${styles.searchFieldContent} container`}>
          <Field>
            <Label className={styles.searchLabel}>{searchLabel}</Label>
            {/*Use 'aria-disabled' because search is not implemented yet*/}
            <Search id='searchId' data-color={'accent'} aria-disabled>
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
      <div className={`${styles.pageContainer} container`}>
        <section className={styles.infoSection}>
          <div>{infoContent}</div>
          <FilterInfoSection filterTags={filterTags} />
        </section>
        <section className={styles.searchHitsContainer}>
          <aside className={styles.filterSection}>
            {filterGroups ? <FiltersPanel filterGroups={filterGroups} /> : null}
          </aside>
          <section className={styles.mainSection}>
            {sortOptions && sortValue && onSortChange && (
              <SortFields sortOptions={sortOptions} sortValue={sortValue} onSortChange={onSortChange} />
            )}
            {searchResult}
          </section>
        </section>
      </div>
    </Tabs>
  );
};

export default SearchPage;
