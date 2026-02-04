import { Label, Search } from '@digdir/designsystemet-react';
import { CollapsibleCard } from '@/components/filters/collapsible-card/';
import { localization } from '@/libs/language';
import styles from '../collapsible-card/collapsable-card.module.css';

interface TextFilterProps {
  label: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function TextFilter({ label, searchTerm, setSearchTerm }: TextFilterProps) {
  return (
    <CollapsibleCard heading={localization.search.textFilter.label}>
      <div className={styles.searchScope}>
        <Label className='ds-sr-only'>{localization.search.textFilter.search}</Label>
        <Search>
          <Search.Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Search.Clear onClick={() => setSearchTerm('')} />
        </Search>
      </div>
    </CollapsibleCard>
  );
}
