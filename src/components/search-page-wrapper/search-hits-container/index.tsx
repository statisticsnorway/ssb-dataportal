import { Pagination, usePagination } from '@digdir/designsystemet-react';
import { ClassificationResource } from '@/libs/data-access/klass';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language/src/localization';
import styles from './search-hit-container.module.css';

type Props = {
  searchHits: RenderedView[] | ClassificationResource[];
  paginationInfo?: { currentPage: number; totalPages: number };
  onPageChange: (page: number) => void;
  noSearchHits: boolean;
  pageSize?: number;
  renderHit: (hit: RenderedView | ClassificationResource) => React.ReactNode;
};

/**
 * Display search hits paginated
 */
const SearchHitContainer = ({
  searchHits = [],
  renderHit,
  paginationInfo,
  onPageChange,
  noSearchHits,
  pageSize = 20,
}: Props) => {
  let pagedHits: RenderedView[] | ClassificationResource[] = searchHits;
  let pages = [];
  let prevButtonProps = {};
  let nextButtonProps = {};

  const hasPagination = !!paginationInfo;

  const totalPages = hasPagination ? Math.ceil(searchHits.length / pageSize) : 1;
  const currentPage = paginationInfo?.currentPage ?? 1;

  if (hasPagination) {
    // slice hits
    const startIndex = (currentPage - 1) * pageSize;
    pagedHits = searchHits.slice(startIndex, startIndex + pageSize);
  }

  // Call hook unconditionally
  const pagination = usePagination({
    currentPage: paginationInfo?.currentPage ?? 1,
    setCurrentPage: onPageChange,
    totalPages,
  });

  pages = pagination.pages;
  prevButtonProps = pagination.prevButtonProps;
  nextButtonProps = pagination.nextButtonProps;

  if (noSearchHits) return <div>No results</div>;

  return (
    <div className={styles.searchHitsContainer}>
      {(noSearchHits || noSearchHits === undefined) && (
        <div className={styles.noHits}>{localization.search.noHits}</div>
      )}
      <p className={styles.numHits}>{searchHits.length} treff</p>
      {/*<div className={styles.hitsList}>{searchHits}</div>*/}
      <div className={styles.hitsList}>{pagedHits.map((hit) => renderHit(hit))}</div>

      {hasPagination && paginationInfo?.totalPages > 1 && (
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
