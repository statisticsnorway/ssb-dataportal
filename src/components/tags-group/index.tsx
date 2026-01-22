import { Button, Tag } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import styles from './tags-group.module.css';

interface TagsGroupProps {
  maxTags: number;
  tagData: TagData;
  closeButton?: boolean;
  onClose?: (key: string) => void;
  onClearAll?: {
    text: string;
    action: () => void;
  };
}

interface TagWithCloseButtonProps {
  onClose?: (key: string) => void;
  label: string;
  id: string;
}

export type TagData = Map<string, string>;

/**
 * Tag component with close button
 */
const TagWithCloseButton: React.FC<TagWithCloseButtonProps> = ({ label, id, onClose }) => {
  return (
    <Tag variant={'outline'} data-size='md' data-color='accent' className={styles.tagWithButton}>
      {label}
      {onClose && (
        <Button className={styles.closeButton} onClick={() => onClose(id)} style={{ marginLeft: 4 }}>
          x
        </Button>
      )}
    </Tag>
  );
};

/**
 * TagsGroup component displays a list of tags with optional close buttons.
 *
 * @param maxTags - Maximum number of tags to display.
 * @param tagData - Map of tag keys and their corresponding labels.
 * @param closeButton=false - Whether each tag should have a close button.
 * @param onClose - Callback triggered when a tag's close button is clicked.
 * @param onClearAll - Optional "Remove All" button configuration.
 *
 * @returns An unordered list (<ul>) of tags, optionally with close buttons and a "Remove All" button.
 */
const TagsGroup = ({ maxTags, tagData, closeButton = false, onClose, onClearAll }: TagsGroupProps) => {
  const tagsArray = useMemo(() => Array.from(tagData.entries()).slice(0, maxTags), [tagData, maxTags]);

  return (
    <ul className={styles.tagsList}>
      {/* Remove All button if used with closeButton and list */}
      {closeButton && tagsArray.length > 1 && onClearAll && (
        <li key='remove-all' style={{ margin: 0 }}>
          <Tag variant='outline' data-color={'accent'} className={styles.closeAllTag}>
            {onClearAll.text}
            <Button className={styles.closeAllButton} onClick={onClearAll.action}>
              x
            </Button>
          </Tag>
        </li>
      )}
      {tagsArray.map(([key, label]) => (
        <li key={key} style={{ margin: 0 }}>
          {closeButton ? (
            <TagWithCloseButton label={label} id={key} onClose={() => onClose?.(key)} />
          ) : (
            <Tag>{label}</Tag>
          )}
        </li>
      ))}
    </ul>
  );
};
export { TagsGroup, TagWithCloseButton };
