import { Pagination, usePagination } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language/src/localization';
import styles from './search-hit-container.module.css';

type Props = {
  searchHits: React.ReactNode[];
  paginationInfo: { currentPage: number; totalPages: number };
  onPageChange: (page: number) => void;
  noSearchHits: boolean;
};

/**
 * Display search hits paginated
 */
const SearchHitContainer = ({ searchHits = [], paginationInfo, onPageChange, noSearchHits }: Props) => {
  const { currentPage, totalPages } = paginationInfo;

  // Generate pages for display
  const { pages, prevButtonProps, nextButtonProps } = usePagination({
    currentPage,
    setCurrentPage: onPageChange,
    totalPages,
    // TODO(): number of showPages should be set based on screen size
    showPages: 4,
  });

  if (noSearchHits) return <div>No results</div>;

  return (
    <div className={styles.searchHitsContainer}>
      {(noSearchHits || noSearchHits === undefined) && (
        <div className={styles.noHits}>{localization.search.noHits}</div>
      )}
      <div className={styles.hitsList}>{searchHits}</div>

      {totalPages > 1 && (
        <Pagination>
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Button aria-label='Forrige' {...prevButtonProps}>
                Forrige
              </Pagination.Button>
            </Pagination.Item>

            {pages.map((p) =>
              p.buttonProps ? (
                <Pagination.Item key={p.itemKey}>
                  <Pagination.Button {...p.buttonProps}>{p.page}</Pagination.Button>
                </Pagination.Item>
              ) : (
                <Pagination.Item key={p.itemKey} />
              ),
            )}

            <Pagination.Item>
              <Pagination.Button aria-label='Neste' {...nextButtonProps}>
                Neste
              </Pagination.Button>
            </Pagination.Item>
          </Pagination.List>
        </Pagination>
      )}
    </div>
  );
};

export { SearchHitContainer };
