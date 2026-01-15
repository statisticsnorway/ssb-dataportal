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
    <Tag>
      {label}
      {onClose && (
        <Button className={styles.closeButton} onClick={() => onClose(id)} style={{ marginLeft: 4 }}>
          ×
        </Button>
      )}
    </Tag>
  );
};

/**
 * Display list of tags
 *
 * @returns
 */
const TagsGroup = ({ maxTags, tagData, closeButton = false, onClose, onClearAll }: TagsGroupProps) => {
  const tagsArray = useMemo(() => Array.from(tagData.entries()).slice(0, maxTags), [tagData, maxTags]);

  return (
    <ul className={styles.tagsList}>
      {/* Remove All button if used with closeButton and list */}
      {closeButton && tagsArray.length > 1 && onClearAll && (
        <li key='remove-all' style={{ margin: 0 }}>
          <Tag>
            <Button className={styles.closeAllButton} onClick={onClearAll.action}>
              {onClearAll.text} <span>X</span>
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
