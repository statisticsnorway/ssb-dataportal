import { Select } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';
import { SortTypes } from '@/types/sort';

interface SortFieldsProps {
  sortOptions: SortTypes[];
  sortOption: SortTypes;
  setSortOption: (key: SortTypes) => void;
}

const sortLabels: Record<string, string> = {
  titleAsc: localization.search.sort.titleAlphabeticalAsc,
  titleDesc: localization.search.sort.titleAlphabeticalDesc,
  lastChanged: localization.search.sort.lastUpdatedFirst,
};

const SortFields = ({ sortOptions, sortOption, setSortOption }: SortFieldsProps) => {
  return (
    <section>
      <Select
        id='sortVariables'
        data-size='sm'
        aria-label={localization.search.sort.label}
        onChange={(e) => setSortOption(e.target.value as SortTypes)}
        value={sortOption}
      >
        {sortOptions.map((key) => (
          <Select.Option key={key} value={key}>
            {sortLabels[key] || key}
          </Select.Option>
        ))}
      </Select>
    </section>
  );
};
export { SortFields };
