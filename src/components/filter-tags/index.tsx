import { Button, Tag } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language/src/localization';
import { FilterItem } from '@/types/filters';
import styles from './filter-tags.module.css';

interface TagsGroupProps {
  activeFilters: FilterItem[];
  onClose?: (key: FilterItem) => void;
  onClearAll: () => void;
}

/**
 * TagsGroup component displays a list of tags with optional close buttons.
 *
 * @param tagData - Map of tag keys and their corresponding labels.
 * @param onClose - Callback triggered when a tag's close button is clicked.
 * @param onClearAll - Optional "Remove All" button configuration.
 *
 * @returns An unordered list (<ul>) of tags, optionally with close buttons and a "Remove All" button
 * or null if tagData is empty.
 */
const FilterTags = ({ activeFilters, onClose, onClearAll }: TagsGroupProps) => {
  return (
    <ul className={styles.tagsList}>
      {activeFilters.length > 1 && (
        <li key='remove-all' style={{ margin: 0 }}>
          <Tag variant='outline' data-color={'accent'} className={styles.closeAllTag}>
            {localization.button.removeFilter}
            <Button className={styles.closeAllButton} onClick={onClearAll}>
              x
            </Button>
          </Tag>
        </li>
      )}
      {activeFilters.map((item) => (
        <li key={item.code} style={{ margin: 0 }}>
          <Tag variant={'outline'} data-size='md' data-color='accent' className={styles.tagWithButton}>
            {item.name}
            {onClose && (
              <Button className={styles.closeButton} onClick={() => onClose(item)} style={{ marginLeft: 4 }}>
                x
              </Button>
            )}
          </Tag>
        </li>
      ))}
    </ul>
  );
};
export { FilterTags };
