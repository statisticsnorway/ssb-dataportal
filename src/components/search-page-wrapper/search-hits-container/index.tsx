import { Pagination, usePagination } from '@digdir/designsystemet-react';
import { JSX, ReactNode } from 'react';
import { localization } from '@/libs/language';
import styles from './search-hit-container.module.css';

type Props = {
  searchHits: unknown[];
  paginationInfo?: { currentPage: number; totalPages: number };
  onPageChange: (page: number) => void;
  noSearchHits: boolean;
  pageSize?: number;
  renderHit: (hit: unknown) => ReactNode | JSX.Element;
};

/**
 * Display search hits paginated
 */
const SearchHitContainer = ({ searchHits = [], renderHit, paginationInfo, onPageChange, noSearchHits }: Props) => {
  let pagedHits: unknown[] = searchHits;

  const hasPagination = !!paginationInfo && !noSearchHits;

  const pagination = usePagination({
    currentPage: paginationInfo?.currentPage ?? 1,
    setCurrentPage: onPageChange,
    totalPages: paginationInfo?.totalPages as number,
    showPages: 8,
  });

  const prevButtonProps = pagination.prevButtonProps;
  const nextButtonProps = pagination.nextButtonProps;
  const pages = pagination.pages;

  return (
    <div className={styles.searchHitsContainer}>
      <div className={styles.hitsList} data-testid='hits-list'>
        {pagedHits.map((hit) => renderHit(hit))}
      </div>
      {hasPagination && (
        <Pagination data-testid={'pagination'}>
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Button aria-label={localization.previous} {...prevButtonProps}>
                {localization.previous}
              </Pagination.Button>
            </Pagination.Item>

            {pages.map((p) =>
              p.buttonProps ? (
                <Pagination.Item key={p.itemKey}>
                  <Pagination.Button
                    {...p.buttonProps}
                    data-testid={paginationInfo?.currentPage === p.page ? 'page-active' : 'page'}
                  >
                    {p.page}
                  </Pagination.Button>
                </Pagination.Item>
              ) : (
                <Pagination.Item key={p.itemKey} />
              ),
            )}

            <Pagination.Item>
              <Pagination.Button aria-label={localization.next} {...nextButtonProps}>
                {localization.next}
              </Pagination.Button>
            </Pagination.Item>
          </Pagination.List>
        </Pagination>
      )}
    </div>
  );
};

export { SearchHitContainer };
