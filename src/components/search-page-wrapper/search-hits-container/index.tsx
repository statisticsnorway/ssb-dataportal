import { Pagination, usePagination } from '@digdir/designsystemet-react';
import { ClassificationResource } from '@/libs/data-access/klass';
import { RenderedView } from '@/libs/data-access/variable-definitions/internal';
import { localization } from '@/libs/language/src/localization';
import styles from './search-hit-container.module.css';

type Props = {
  searchHits: RenderedView[] | ClassificationResource[];
  totalHits?: number;
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
  totalHits,
  noSearchHits,
}: Props) => {
  let pagedHits: RenderedView[] | ClassificationResource[] = searchHits;

  const hasPagination = !!paginationInfo;

  const pagination = usePagination({
    currentPage: paginationInfo?.currentPage ?? 1,
    setCurrentPage: onPageChange,
    totalPages: paginationInfo?.totalPages as number,
    showPages: 8,
  });

  const prevButtonProps = pagination.prevButtonProps;
  const nextButtonProps = pagination.nextButtonProps;
  const pages = pagination.pages;

  if (noSearchHits) return <div>No results</div>;

  return (
    <div className={styles.searchHitsContainer}>
      {(noSearchHits || noSearchHits === undefined) && (
        <div className={styles.noHits}>{localization.search.noHits}</div>
      )}
      <p className={styles.numHits}>{totalHits} treff</p>
      <div className={styles.hitsList}>{pagedHits.map((hit) => renderHit(hit))}</div>

      {hasPagination && (
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
