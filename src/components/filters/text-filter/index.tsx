import { Label, Search } from '@digdir/designsystemet-react';
import { CollapsibleCard } from '@/components/filters/collapsible-card/';
import styles from '../collapsible-card/collapsable-card.module.css';

interface TextFilterProps {
  label: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function TextFilter({ label, searchTerm, setSearchTerm }: TextFilterProps) {
  return (
    <CollapsibleCard heading='Filtrer'>
      <Label htmlFor='search-input'>{label}</Label>
      <div className={styles.searchScope}>
        <Search>
          <Search.Input id='search-input' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Search.Clear onClick={() => setSearchTerm('')} />
        </Search>
      </div>
    </CollapsibleCard>
  );
}
