'use client';

import { Field, Label, Search, Tabs } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactElement, ReactNode } from 'react';
import { getTabForId, getTabForRoute, tabsData } from '@/app/tabs';
import { SortFields } from '@/components/sort-fields';
import { localization } from '@/libs/language';
import { SortTypes } from '@/types/sort';
import styles from './search-page.module.css';

interface SearchPageProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  infoContent?: ReactNode;
  asideContent?: ReactNode;
  searchResult?: ReactElement;
  searchLabel?: string;
  sortOptions?: ReadonlyArray<SortTypes>;
  sortValue?: SortTypes;
  onSortChange?: (key: SortTypes) => void;
  totalHits?: number;
}

const SearchPage: FC<SearchPageProps> = ({
  infoContent,
  asideContent,
  searchResult,
  searchLabel,
  sortOptions,
  sortValue,
  onSortChange,
  totalHits,
}: SearchPageProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const derivedTab = getTabForRoute(pathname);

  return (
    <Tabs
      value={derivedTab?.id}
      data-color='accent'
      onChange={(value: string) => router.push(getTabForId(value)?.route || '/')}
    >
      <section className={styles.searchPageWrapper}>
        <div className={`${styles.searchFieldContent} container`}>
          <Field>
            <Label className={styles.searchLabel}>{searchLabel}</Label>
            {/*Use 'aria-disabled' because search is not implemented yet*/}
            <Search id='searchId' data-color={'accent'} aria-disabled>
              <Search.Input id='searchValue' aria-label={localization.search.label} />
              <Search.Clear />
              <Search.Button>Søk</Search.Button>
            </Search>
          </Field>
        </div>
        <div className={`${styles.tabsNavigationContainer} container`}>
          <Tabs.List className={styles.tabsNavigation}>
            {Object.values(tabsData).map((tab) => (
              <Tabs.Tab key={tab.id} value={tab.id} className={styles.tab}>
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </div>
      </section>
      <div className={`${styles.pageContainer} container`}>
        {infoContent ? infoContent : null}
        <section className={styles.searchHitsContainerWrapper}>
          {asideContent ? <aside className={styles.filterSection}>{asideContent}</aside> : null}
          <section className={styles.mainSection}>
            <div className={styles.hitsAndSort}>
              {totalHits ? (
                <p className={styles.numHits}>
                  {totalHits == 0 ? localization.search.noHits : `${totalHits} ${localization.search.hits}`}
                </p>
              ) : undefined}
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
