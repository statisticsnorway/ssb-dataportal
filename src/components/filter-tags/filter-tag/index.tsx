import { Button, Tag } from '@digdir/designsystemet-react';
import styles from '../filter-tags.module.css';

interface FilterTagProps {
  label: string | undefined;
  onClose?: () => void;
  isClearAll?: boolean;
  filterCount?: number;
}

export const FilterTag = ({ label, onClose, isClearAll, filterCount }: FilterTagProps) => {
  return (
    <li>
      <Tag
        variant='outline'
        data-size='md'
        data-color='accent'
        className={isClearAll ? styles.closeAllTag : styles.tagWithButton}
      >
        {label}
        {filterCount !== undefined && ` (${filterCount})`}
        {onClose && (
          <Button
            className={isClearAll ? styles.closeAllButton : styles.closeButton}
            onClick={onClose}
            aria-label={`Remove ${label}`}
          >
            ×
          </Button>
        )}
      </Tag>
    </li>
  );
};
