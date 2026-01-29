import { Select } from '@digdir/designsystemet-react';
import { SortTypes } from '@/types/tabs';
import { filter } from '@/utils/constants';

interface SortFieldsProps {
  sortOptions: SortTypes[];
  sortOption: SortTypes;
  setSortOption: (v: any) => void;
}

const sortLabels: Record<string, string> = {
  titleAsc: filter.sortNameAsc,
  titleDesc: filter.sortNameDesc,
  lastChanged: filter.sortLastUpdated,
};

const SortFields = ({ sortOptions, sortOption, setSortOption }: SortFieldsProps) => {
  return (
    <section>
      <Select
        id='sortVariables'
        data-size='sm'
        aria-label='Select sort'
        onChange={(e) => setSortOption(e.target.value)}
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
