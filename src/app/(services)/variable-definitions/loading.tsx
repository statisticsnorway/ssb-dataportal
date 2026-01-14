import { SearchPageSkeleton } from '@/components/search-page-wrapper/search-page-skeleton';

export default function Loading() {
  return <SearchPageSkeleton showFilters={true} itemCount={4} />;
}
