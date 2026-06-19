import { TextFilter } from '@/components/filters/text-filter';
import { localization } from '@/libs/language/src/localization';

interface KlassSearchSectionProps {
  onQueryChange: (query: string) => void;
  query?: string;
}

export const KlassSearchSection = ({ query, onQueryChange }: KlassSearchSectionProps) => {
  return (
    <TextFilter
      label={localization.search.label}
      searchTerm={query ?? ''}
      setSearchTerm={(value: string) => onQueryChange(value)}
    />
  );
};
