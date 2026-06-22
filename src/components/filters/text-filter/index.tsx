import { Search } from '@statisticsnorway/design-react';
import { CollapsibleCard } from '@/components/filters/collapsible-card/';
import { localization } from '@/libs/language';
import styles from './text-filter.module.css';

interface TextFilterProps {
  label: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function TextFilter({ label, searchTerm, setSearchTerm }: Readonly<TextFilterProps>) {
  return (
    <CollapsibleCard heading={label}>
      <div className={styles.searchScope}>
        <Search>
          <Search.Input
            id={localization.search.textFilter.inputId}
            aria-label={label}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search.Clear onClick={() => setSearchTerm('')} />
        </Search>
      </div>
    </CollapsibleCard>
  );
}
