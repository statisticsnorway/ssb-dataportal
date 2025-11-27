'use client';

import React, { useMemo } from 'react';
import { SearchHitContainer } from '@/components/search-hits-container';
import SortFields from '@/components/sort-fields';
import { SortTypes, useSearchStateKlass } from '@/hooks/useSearchStateKlass';
import { localization } from '@/libs/language';
import { Classification } from '@/types/classification';
import { FilterGroup } from '@/types/filters';
import SearchPage from '../../../../components/search-page/searchPage';
import { ClassificationSearchHit } from './classificationSearchHit';

interface ClassificationServicePageProps {
  rawHits: Classification[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  filterGroups: FilterGroup[];
}

const ClassificationsServicePage = ({
  rawHits,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  filterGroups,
}: ClassificationServicePageProps) => {
  const memoizedHits = useMemo(() => (isLoading ? [] : rawHits), [isLoading, rawHits]);

  const { hits, sortKey, setSortKey, sortTypes } = useSearchStateKlass(memoizedHits);

  const PAGE_SIZE = 20;
  const startIndex = currentPage * PAGE_SIZE;
  const pagedHits = hits.slice(startIndex, startIndex + PAGE_SIZE);

  console.log(
    'Filters: ',
    filterGroups.map((filterGroup) => filterGroup.selectedItems),
  );

  console.log('Pagination info:', { currentPage, totalPages });
  console.log('Pagination pages:', { pagedHits });
  console.log('pages:', { hits });

  return (
    <SearchPage
      filterGroups={filterGroups}
      searchResult={
        <>
          <SortFields
            sortOptions={sortTypes}
            sortValue={sortKey}
            onSortChange={(key: string) => setSortKey(key as SortTypes)}
          />
          {isLoading ? (
            <div>Loading...</div>
          ) : hits.length === 0 ? (
            <div>{localization.search.noHits}</div>
          ) : (
            <SearchHitContainer
              searchHits={pagedHits.map((hit) => <ClassificationSearchHit key={hit.id} classification={hit} />)}
              noSearchHits={false}
              onPageChange={onPageChange}
              paginationInfo={{
                currentPage: currentPage,
                totalPages: totalPages,
              }}
            />
          )}
        </>
      }
    />
  );
};

export default ClassificationsServicePage;
