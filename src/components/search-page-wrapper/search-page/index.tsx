'use client';

import { Field, Label, Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactElement, ReactNode } from 'react';
import { SortFields } from '@/components/sort-fields';
import { SortTypes } from '@/hooks/useSearchStateKlass';
import { FilterGroup } from '@/types/filters';
import styles from './search-page.module.css';

interface SearchPageProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  searchResult?: ReactElement;
  filterGroups?: FilterGroup[];
  searchLabel?: string;
  sortOptions?: SortTypes[];
  sortValue?: SortTypes;
  onSortChange?: (key: string) => void;
  totalHits?: number;
}

const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  asideContent,
  searchResult,
  filterGroups,
  searchLabel,
  sortOptions,
  sortValue,
  onSortChange,
  totalHits,
}) => {
  const router = useRouter();
  const pathname = usePathname();

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

  const tabRoutes: Record<string, string> = {
    klassTab: '/classifications',
    vardefTab: '/variable-definitions',
    datasetTab: '/datasets',
  };

  return (
    <Tabs value={derivedTab} data-color='accent' onChange={(value) => router.push(tabRoutes[value] || '/')}>
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
        {infoContent ? <div>{infoContent}</div> : null}
        <section className={styles.searchHitsContainer}>
          {asideContent ? <aside className={styles.filterSection}>{asideContent}</aside> : null}
          <section className={styles.mainSection}>
            <div className={styles.hitsAndSort}>
              <p className={styles.numHits}>{totalHits} treff</p>
              {sortOptions && sortValue && onSortChange && (
                <SortFields sortOptions={sortOptions} sortValue={sortValue} onSortChange={onSortChange} />
              )}
            </div>
            {searchResult}
          </section>
        </section>
      </div>
    </Tabs>
  );
};

export { SearchPage };
