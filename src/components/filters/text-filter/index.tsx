import { Label, Search } from '@digdir/designsystemet-react';
import { CollapsibleCard } from '@/components/filters/collapsible-card/';
import styles from '../collapsible-card/collapsable-card.module.css';

export function TextFilter({
  field,
  filters,
  setFilters,
}: {
  field: string;
  filters: Record<string, string>;
  setFilters: (f: Record<string, string>) => void;
}) {
  return (
    <CollapsibleCard heading='Filtrer'>
      <Label htmlFor={`search-${field}`}>Filtrer på navn</Label>
      <div className={styles.searchScope}>
        <Search>
          <Search.Input
            id={`search-${field}`}
            value={filters[field] || ''}
            onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
          />
          <Search.Clear onClick={() => setFilters({ ...filters, [field]: '' })} />
        </Search>
      </div>
    </CollapsibleCard>
  );
}
