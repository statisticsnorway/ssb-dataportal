import { Search } from '@digdir/designsystemet-react';
import { CollapsibleCard } from '@/components/filters/collapsible-card/';
import { localization } from '@/libs/language';
import styles from './text-filter.module.css';

interface TextFilterProps {
  label: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  variant?: 'card' | 'flat';
  defaultOpen?: boolean;
}

/**
 * Renders a collapsible text search filter.
 *
 * @param variant - Whether the filter uses the card or flat presentation.
 * @param defaultOpen - Whether the filter is initially expanded.
 */
export function TextFilter({
  label,
  searchTerm,
  setSearchTerm,
  variant = 'card',
  defaultOpen = true,
}: Readonly<TextFilterProps>) {
  return (
    <CollapsibleCard heading={label} variant={variant} defaultOpen={defaultOpen}>
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
