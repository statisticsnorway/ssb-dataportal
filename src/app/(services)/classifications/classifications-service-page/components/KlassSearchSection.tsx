import { TextFilter } from '@/components/filters/text-filter';
import { localization } from '@/libs/language/src/localization';

interface KlassSearchSectionProps {
  onQueryChange: (query: string) => void;
  query?: string;
}

// language
// map hits
// onChange

// filter searchResult with language
// map searchResult to classifications

// biome-ignore lint/suspicious/noConsole: <explanation>
//console.log(classifications, searchResults);
/*
  const filterItems = useMemo(() => createTypeFilterItems(classifications), [classifications]);
  const selectedItems = useMemo(
    () => selectedClassificationTypes.map((value) => ({ value, label: value, category: CLASSIFICATION_TYPE_CATEGORY })),
    [selectedClassificationTypes],
  );
*/
/*
setSearchTerm={(value) =>
                void setQueryState({
                  q: value || null,
                  page: 1,
                })
              }
*/
export const KlassSearchSection = ({ query, onQueryChange }: KlassSearchSectionProps) => {
  return (
    <TextFilter
      label={localization.search.label}
      searchTerm={query ?? ''}
      setSearchTerm={(value: string) => onQueryChange(value)}
    />
  );
};
