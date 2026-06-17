import { use } from 'react';
import { TextFilter } from '@/components/filters/text-filter';
import { localization } from '@/libs/language/src/localization';
import { useClassificationContext } from './classificationContext';

interface KlassSearchSectionProps {
  onQueryChange: (query: string) => void;
  query?: string;
}

export const KlassSearchSection = ({ query, onQueryChange }: KlassSearchSectionProps) => {
  const { classificationsPromise, searchResultPromise } = useClassificationContext();
  const { data: classifications } = use(classificationsPromise);
  const { data: searchResults } = use(searchResultPromise);

  // language
  // map hits
  // onChange

  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log(classifications, searchResults);
  /*
  const filterItems = useMemo(() => createTypeFilterItems(classifications), [classifications]);
  const selectedItems = useMemo(
    () => selectedClassificationTypes.map((value) => ({ value, label: value, category: CLASSIFICATION_TYPE_CATEGORY })),
    [selectedClassificationTypes],
  );
*/
  return (
    <TextFilter
      label={localization.search.label}
      searchTerm={query ?? ''}
      setSearchTerm={function (value: string): void {
        onQueryChange(value);
      }}
    />
  );
};
